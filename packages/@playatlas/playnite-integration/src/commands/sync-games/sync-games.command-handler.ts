import { extractSyncData, type ExtractedSyncData } from "./sync-data.extractor";
import type { ISyncGamesCommandHandlerPort, SyncGamesServiceDeps } from "./sync-games.service.type";

export const makeSyncGamesCommandHandler = ({
	logService,
	gameRepository,
	genreRepository,
	platformRepository,
	companyRepository,
	completionStatusRepository,
	libraryManifestService,
	eventBus,
	clock,
}: SyncGamesServiceDeps): ISyncGamesCommandHandlerPort => {
	return {
		executeAsync: async (command) => {
			const payload = command.payload;
			const now = clock.now();

			logService.info(
				`Syncing game library (add: ${payload.toAdd.length} games, update: ${payload.toUpdate.length} games, delete: ${payload.toRemove.length} games)`,
			);

			let extracted: ExtractedSyncData;

			try {
				const games = gameRepository.all();
				const existingGames = new Map(games.map((g) => [g.getPlayniteSnapshot().id, g]));
				extracted = extractSyncData({ command, now, existingGames });
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
				payload: { added: extracted.added, updated: extracted.updated, deleted: extracted.deleted },
			});

			return {
				reason: "Game library synchronized",
				reason_code: "game_library_synchronized",
				success: true,
			};
		},
	};
};
