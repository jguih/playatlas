import {
	buildGameLibrarySyncContext,
	extractSyncData,
	type ExtractedSyncData,
} from "./sync-data.extractor";
import type { ISyncGamesCommandHandlerPort, SyncGamesServiceDeps } from "./sync-games.service.type";

export const makeSyncGamesCommandHandler = ({
	logService,
	libraryManifestService,
	eventBus,
	clock,
	gameLibraryUnitOfWork: gameLibraryUow,
}: SyncGamesServiceDeps): ISyncGamesCommandHandlerPort => {
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

				try {
					extracted = extractSyncData({
						command,
						now,
						context,
						...factories,
					});
				} catch (error) {
					logService.error(`Failed to parse game library sync payload`, error);
					return {
						success: false,
						reason_code: "failed_to_parse_payload",
						reason: `Failed to parse payload`,
					};
				}

				genreRepository.upsert(extracted.genres);
				platformRepository.upsert(extracted.platforms);
				companyRepository.upsert(extracted.developers);
				companyRepository.upsert(extracted.publishers);
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
