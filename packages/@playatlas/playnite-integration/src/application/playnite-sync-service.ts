import type {
	IPlayniteSyncServicePort,
	PlayniteSynchronizationResult,
} from "./playnite-sync-service.port";
import type { PlayniteSyncServiceDeps } from "./playnite-sync-service.types";

export const makePlayniteSyncService = ({
	playniteMediaFilesHandler: handler,
	gameRepository,
	libraryManifestService,
	logService,
}: PlayniteSyncServiceDeps): IPlayniteSyncServicePort => {
	const handleMediaFilesSynchronizationRequest: IPlayniteSyncServicePort["handleMediaFilesSynchronizationRequest"] =
		async (request) => {
			return await handler.withMediaFilesContext(
				request,
				async (context): Promise<PlayniteSynchronizationResult> => {
					const { gameContext } = context;

					if (!(await handler.verifyIntegrity(context)))
						return {
							success: false,
							reason: "Integrity check validation failed",
							reason_code: "integrity_check_failed",
						};

					const game = gameRepository.getByPlayniteId(gameContext.getPlayniteGameId());
					if (!game) {
						logService.debug(`Game not found with Playnite id: ${gameContext.getPlayniteGameId()}`);

						return {
							reason: "Game not found",
							reason_code: "game_not_found",
							success: false,
						};
					}

					const optimized = await handler.processImages(context);
					await handler.moveProcessedImagesToGameFolder(context);
					await handler.writeContentHashFileToGameFolder(context);

					for (const entry of optimized)
						game.setImageReference({
							name: entry.name,
							path: { filename: entry.filename },
						});

					gameRepository.upsert(game);

					await libraryManifestService.write();

					return { success: true, reason: "success", reason_code: "success" };
				},
			);
		};

	return {
		handleMediaFilesSynchronizationRequest,
	};
};
