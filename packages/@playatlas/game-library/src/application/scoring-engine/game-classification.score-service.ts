import type { ILogServicePort } from "@playatlas/common/application";
import {
	CLASSIFICATION_IDS,
	DomainError,
	GameClassificationIdParser,
	type ClassificationId,
	type GameId,
} from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import { monotonicFactory } from "ulid";
import type { Game } from "../../domain/game.entity";
import type { IGameRepositoryPort } from "../../infra/game.repository.port";
import type { IGenreRepositoryPort } from "../../infra/genre.repository.port";
import type { IGameClassificationRepositoryPort } from "../../infra/scoring-engine/game-classification.repository";
import type { IScoreEngineRegistryPort } from "./engine.registry";
import type { IGameClassificationFactoryPort } from "./game-classification.factory";

export type RescoreGameItem = {
	game: Game;
	/**
	 * Classifications to rescore. If empty or undefined, will rescore `all` classifications.
	 */
	classificationIds?: ClassificationId[];
};

export type IGameClassificationScoreServicePort = {
	rescoreGames: (game: RescoreGameItem | RescoreGameItem[]) => void;
	computeMissingScores: () => void;
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
	const self: Omit<
		IGameClassificationScoreServicePort,
		"reconcileEngineVersion" | "computeMissingScores"
	> = {
		rescoreGames: (game) => {
			const start = performance.now();
			const now = clock.now();
			const games = Array.isArray(game) ? game : [game];

			logService.info(`Calculating classification scores for ${games.length} game(s).`);

			if (games.length === 0) {
				const duration = performance.now() - start;
				logService.success(
					`Classification score calculation completed after ${duration.toFixed(1)}ms.`,
					{
						totalGames: games.length,
						totalClassifications: CLASSIFICATION_IDS.length,
						expectedOperations: games.length * CLASSIFICATION_IDS.length,
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
				const gameClassificationsByGame = gameClassificationRepository.getLatestByGame();
				let skipped = 0;
				let created = 0;

				logService.info(`Operation summary:`, {
					totalClassifications: CLASSIFICATION_IDS.length,
					existingLatestRecords: gameClassificationsByGame.size,
					genresSnapshotSize: genresSnapshot.size,
				});

				for (const { game, classificationIds } of games) {
					const resolvedClassificationIds =
						classificationIds && classificationIds.length > 0
							? new Set(classificationIds).values().toArray()
							: CLASSIFICATION_IDS;

					for (const classificationId of resolvedClassificationIds) {
						const engine = scoreEngineRegistry.get(classificationId);

						if (!engine) throw new DomainError(`Missing engine for ${classificationId}`);

						const { score, normalizedScore, mode, breakdown } = engine.score({
							game,
							genresSnapshot,
						});

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
							normalizedScore,
							mode,
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
						totalClassifications: CLASSIFICATION_IDS.length,
						expectedOperations: games.length * CLASSIFICATION_IDS.length,
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
		computeMissingScores: () => {
			const start = performance.now();

			logService.info(`Computing missing game scores`);

			try {
				const gamesMissingScores: RescoreGameItem[] = [];
				const games = gameRepository.all({ load: true });
				const gameClassificationsPerGame = gameClassificationRepository.getLatestByGame();

				for (const game of games) {
					const gameClassificationsMap = gameClassificationsPerGame.get(game.getId());

					if (!gameClassificationsMap || gameClassificationsMap.size === 0) {
						gamesMissingScores.push({ game, classificationIds: CLASSIFICATION_IDS });
						continue;
					}

					const missingClassificationIds: ClassificationId[] = [];

					for (const classificationId of CLASSIFICATION_IDS) {
						const gameClassification = gameClassificationsMap.get(classificationId);

						if (!gameClassification) {
							missingClassificationIds.push(classificationId);
						}
					}

					if (missingClassificationIds.length > 0) {
						gamesMissingScores.push({
							game,
							classificationIds: missingClassificationIds,
						});
					}
				}

				if (gamesMissingScores.length > 0) {
					logService.info(`Computing missing scores for ${gamesMissingScores.length} games`);
					self.rescoreGames(gamesMissingScores);
				}
			} catch (error) {
				const duration = performance.now() - start;
				logService.error(`Computing missing game scores failed after ${duration.toFixed(1)}`);
				throw error;
			}
		},
		reconcileEngineVersion: () => {
			const start = performance.now();

			logService.info(`Reconciling score engines versions`);

			try {
				const latestClassificationsByGame = gameClassificationRepository.getLatestByGame();
				const gamesToRescore = new Map<GameId, Set<ClassificationId>>();

				for (const classificationId of CLASSIFICATION_IDS) {
					const engine = scoreEngineRegistry.get(classificationId);

					for (const [gameId, gameClassificationMap] of latestClassificationsByGame) {
						const gameClassification = gameClassificationMap.get(classificationId);

						if (!gameClassification || gameClassification.getEngineVersion() !== engine.version) {
							let classificationIds = gamesToRescore.get(gameId);
							if (!classificationIds) {
								classificationIds = new Set();
								gamesToRescore.set(gameId, classificationIds);
							}
							classificationIds.add(classificationId);
						}
					}
				}

				if (gamesToRescore.size === 0) {
					logService.info(
						`Latest score engines versions are the same as current, nothing to reconcile`,
					);
					return;
				}

				logService.info(
					`Outdated score engine version detected, will rescore ${gamesToRescore.size} games`,
				);

				const games = gameRepository.all({ load: true });
				const rescoreItems: RescoreGameItem[] = [];

				for (const [gameId, classificationIds] of gamesToRescore) {
					const game = games.find((g) => g.getId() === gameId);
					if (game)
						rescoreItems.push({ game, classificationIds: classificationIds.values().toArray() });
				}

				self.rescoreGames(rescoreItems);

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
