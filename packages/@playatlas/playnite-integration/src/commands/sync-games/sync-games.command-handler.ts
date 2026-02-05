import { InvalidStateError, type GenreId } from "@playatlas/common/domain";
import {
	makeHorrorEvidenceExtractor,
	makeHorrorScorer,
	makeHorrorScoringPolicy,
	type CanonicalGenreId,
	type ScoreResult,
} from "@playatlas/game-library/application";
import type { Genre } from "@playatlas/game-library/domain";
import * as fs from "fs/promises";
import {
	buildGameLibrarySyncContext,
	extractSyncData,
	type ExtractedSyncData,
	type GameLibrarySyncContext,
} from "./sync-data.extractor";
import type { ISyncGamesCommandHandlerPort, SyncGamesServiceDeps } from "./sync-games.service.type";

export const makeSyncGamesCommandHandler = ({
	logService,
	libraryManifestService,
	eventBus,
	clock,
	gameLibraryUnitOfWork: gameLibraryUow,
}: SyncGamesServiceDeps): ISyncGamesCommandHandlerPort => {
	const horrorEvidenceExtractor = makeHorrorEvidenceExtractor();
	const horrorScoringPolicy = makeHorrorScoringPolicy();
	const horrorScorer = makeHorrorScorer({ horrorEvidenceExtractor, horrorScoringPolicy });

	// TODO: Remove
	const testScorer = async (context: GameLibrarySyncContext) => {
		const sample = context.games.values().toArray();
		const genres = context.genres.values().toArray();
		const genresMap = new Map<GenreId, Genre>(genres.map((g) => [g.getId(), g]));
		const messageBuilder: Array<{
			genreId: CanonicalGenreId;
			game: {
				name?: string | null;
				genres: string[];
			};
			result: ScoreResult;
		}> = [];

		for (const game of sample) {
			const gameGenres: string[] = [];

			if (game.relationships.genres.isLoaded())
				game.relationships.genres.get().forEach((gId) => {
					const genre = genresMap.get(gId);
					if (genre) gameGenres.push(genre.getName());
				});

			const result = horrorScorer.score({
				game,
				genresSnapshot: genresMap,
			});
			if (result.score === 0) continue;

			messageBuilder.push({
				genreId: horrorScorer.id,
				game: {
					name: game.getPlayniteSnapshot()?.name,
					genres: gameGenres,
				},
				result,
			});
		}

		const sorted = messageBuilder.sort((a, b) => {
			const aScore = a.result.score;
			const bScore = b.result.score;

			if (aScore < bScore) return 1;
			if (aScore > bScore) return -1;
			return 0;
		});

		await fs.writeFile("/tmp/playatlas/genre-test.json", JSON.stringify(sorted, null, 2));
	};

	return {
		executeAsync: async (command) => {
			const payload = command.payload;

			logService.info(
				`Syncing game library (add: ${payload.toAdd.length} games, update: ${payload.toUpdate.length} games, delete: ${payload.toRemove.length} games)`,
			);

			return gameLibraryUow.runAsync(async ({ factories, repositories }) => {
				const now = clock.now();

				const {
					companyRepository,
					completionStatusRepository,
					gameRepository,
					genreRepository,
					platformRepository,
				} = repositories;

				let extracted: ExtractedSyncData;

				const context = buildGameLibrarySyncContext({ ...repositories });

				// TODO: Remove
				await testScorer(context);

				try {
					extracted = extractSyncData({
						command,
						now,
						context,
						...factories,
					});
				} catch (error) {
					if (error instanceof InvalidStateError) {
						logService.error("Game library sync rejected by domain rules", error);
						return {
							success: false,
							reason_code: "domain_rejected_sync",
							reason: error.message,
						};
					}

					throw error;
				}

				genreRepository.upsert(extracted.genres);
				platformRepository.upsert(extracted.platforms);
				companyRepository.upsert(extracted.companies);
				completionStatusRepository.upsert(extracted.completionStatuses);
				gameRepository.upsert(extracted.games);

				await libraryManifestService.write();

				logService.success(`Game library synchronized`);

				eventBus.emit({
					id: crypto.randomUUID(),
					name: "game-library-synchronized",
					occurredAt: now,
					payload: {
						added: extracted.added,
						updated: extracted.updated,
						deleted: extracted.deleted,
					},
				});

				return {
					reason: "Game library synchronized",
					reason_code: "game_library_synchronized",
					success: true,
				};
			});
		},
	};
};
