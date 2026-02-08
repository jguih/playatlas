import type { ILogServicePort } from "@playatlas/common/application";
import {
	classificationIds as commonDomainClassificationIds,
	DomainError,
	GameClassificationIdParser,
	type ClassificationId,
	type GameId,
} from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import { monotonicFactory } from "ulid";
import type { Game } from "../../domain/game.entity";
import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";
import type { IGameRepositoryPort } from "../../infra/game.repository.port";
import type { IGenreRepositoryPort } from "../../infra/genre.repository.port";
import type { IGameClassificationRepositoryPort } from "../../infra/scoring-engine/game-classification.repository";
import type { IScoreEngineRegistryPort } from "./engine.registry";
import type { IGameClassificationFactoryPort } from "./game-classification.factory";

type RescoreGamesFnArgs = {
	/**
	 * Classifications to rescore. If empty, will rescore `all` classifications.
	 */
	classificationIds?: ClassificationId[];
};

export type IGameClassificationScoreServicePort = {
	rescoreGames: (game: Game | Game[], args?: RescoreGamesFnArgs) => void;
	reconcileEngineVersion: () => void;
};

export type GameClassificationScoreServiceDeps = {
	scoreEngineRegistry: IScoreEngineRegistryPort;
	genreRepository: IGenreRepositoryPort;
	gameClassificationFactory: IGameClassificationFactoryPort;
	gameClassificationRepository: IGameClassificationRepositoryPort;
	gameRepository: IGameRepositoryPort;
	clock: IClockPort;
	logService: ILogServicePort;
};

export const makeGameClassificationScoreService = ({
	scoreEngineRegistry,
	genreRepository,
	gameClassificationFactory,
	gameClassificationRepository,
	gameRepository,
	clock,
	logService,
}: GameClassificationScoreServiceDeps): IGameClassificationScoreServicePort => {
	const self: Omit<IGameClassificationScoreServicePort, "reconcileEngineVersion"> = {
		rescoreGames: (game, args = {}) => {
			const start = performance.now();
			const now = clock.now();
			const games = Array.isArray(game) ? game : [game];
			const classificationIds = args.classificationIds
				? args.classificationIds
				: commonDomainClassificationIds;

			logService.info(`Calculating classification scores for ${games.length} game(s).`);

			if (games.length === 0) {
				const duration = performance.now() - start;
				logService.success(
					`Classification score calculation completed after ${duration.toFixed(1)}ms.`,
					{
						totalGames: games.length,
						totalClassifications: classificationIds.length,
						expectedOperations: games.length * classificationIds.length,
						skipped: 0,
						created: 0,
						formula: "games x classifications - skipped",
						durationMs: duration,
					},
				);
				return;
			}

			try {
				const ulid = monotonicFactory();
				const genres = genreRepository.all();
				const genresSnapshot = new Map(genres.map((g) => [g.getId(), g]));
				const gameClassifications = gameClassificationRepository.all();
				const gameClassificationsByGame = new Map<
					GameId,
					Map<ClassificationId, GameClassification>
				>();
				let skipped = 0;
				let created = 0;

				logService.info(`Operation summary:`, {
					totalClassifications: classificationIds.length,
					existingRecords: gameClassifications.length,
					genresSnapshotSize: genresSnapshot.size,
				});

				for (const gc of gameClassifications) {
					const gameId = gc.getGameId();
					const classificationId = gc.getClassificationId();

					let byClassification = gameClassificationsByGame.get(gameId);
					if (!byClassification) {
						byClassification = new Map();
						gameClassificationsByGame.set(gameId, byClassification);
					}

					/**
					 * Since the repo return items ordered by latest updated ASC,
					 * this is guaranteed to have the latest updated item by the
					 * time the loop ends
					 */
					byClassification.set(classificationId, gc);
				}

				for (const classificationId of classificationIds) {
					const engine = scoreEngineRegistry.get(classificationId);

					if (!engine) throw new DomainError(`Missing engine for ${classificationId}`);

					for (const game of games) {
						const { score, breakdown } = engine.score({ game, genresSnapshot });
						const breakdownJson = engine.serializeBreakdown(breakdown);
						const latestGameClassification = gameClassificationsByGame
							.get(game.getId())
							?.get(classificationId);

						if (latestGameClassification) {
							const latestScore = latestGameClassification.getScore();
							const latestEngineVersion = latestGameClassification.getEngineVersion();

							if (score === latestScore && engine.version === latestEngineVersion) {
								logService.debug(`Game with id ${game.getSafeId()} skipped (no change detected).`, {
									gameId: game.getSafeId(),
									score,
									latestScore,
									engineVersion: engine.version,
									latestEngineVersion,
								});
								skipped++;
								continue;
							}
						}

						const gameClassification = gameClassificationFactory.create({
							id: GameClassificationIdParser.fromTrusted(ulid()),
							classificationId: classificationId,
							gameId: game.getId(),
							score,
							breakdownJson,
							engineVersion: engine.version,
							createdAt: now,
							lastUpdatedAt: now,
						});

						gameClassificationRepository.add(gameClassification);
						created++;
						logService.debug(`Game classification created`, {
							gameId: game.getId(),
							classificationId,
							oldScore: latestGameClassification?.getScore() ?? null,
							newScore: score,
							oldVersion: latestGameClassification?.getEngineVersion() ?? null,
							newVersion: engine.version,
						});
					}
				}

				const duration = performance.now() - start;
				logService.success(
					`Classification score calculation completed after ${duration.toFixed(1)}ms.`,
					{
						totalGames: games.length,
						totalClassifications: classificationIds.length,
						expectedOperations: games.length * classificationIds.length,
						skipped,
						created,
						formula: "games x classifications - skipped",
						durationMs: duration,
					},
				);
			} catch (error) {
				const duration = performance.now() - start;
				logService.error(`Classification score calculation failed after ${duration.toFixed(1)}ms`);
				throw error;
			}
		},
	};

	return {
		rescoreGames: self.rescoreGames,
		reconcileEngineVersion: () => {
			const start = performance.now();

			logService.info(`Reconciling score engines versions`);

			try {
				const latestVersions = gameClassificationRepository.getLatestEngineVersions();
				const classificationsToRescore = new Set<ClassificationId>();

				logService.debug(`Latest used engines versions: `, latestVersions);

				for (const engine of Object.values(scoreEngineRegistry.list())) {
					const storedVersion = latestVersions.get(engine.id);

					if (!storedVersion || storedVersion !== engine.version) {
						classificationsToRescore.add(engine.id);
					}
				}

				if (classificationsToRescore.size === 0) {
					logService.info(
						`Latest score engines versions are the same as current, nothing to reconcile`,
					);
					return;
				}

				logService.info(
					`Outdated score engine version detected, will rescore all games for classification ids: ${classificationsToRescore.values().toArray().join(", ")}`,
				);

				const games = gameRepository.all();

				self.rescoreGames(games, {
					classificationIds: [...classificationsToRescore],
				});

				const duration = performance.now() - start;
				logService.success(
					`Score engines versions reconciliation completed after ${duration.toFixed(1)}ms`,
				);
			} catch (error) {
				const duration = performance.now() - start;
				logService.error(
					`Score engines versions reconciliation failed after ${duration.toFixed(1)}ms`,
				);
				throw error;
			}
		},
	};
};
