import { type ICommandHandlerPort } from "@playatlas/common/application";
import type { StaleGameSessionCommand } from "./stale-session.command";
import type {
	StaleGameSessionCommandResult,
	StaleGameSessionServiceDeps,
} from "./stale-session.types";

export type IStaleGameSessionCommandHandlerPort = ICommandHandlerPort<
	StaleGameSessionCommand,
	StaleGameSessionCommandResult
>;

export const makeStaleGameSessionCommandHandler = ({
	gameSessionRepository,
	logService,
	gameInfoProvider,
	eventBus,
	clock,
	gameSessionFactory,
}: StaleGameSessionServiceDeps): IStaleGameSessionCommandHandlerPort => {
	return {
		execute: (command: StaleGameSessionCommand): StaleGameSessionCommandResult => {
			const gameInfo = gameInfoProvider.getGameInfo(command.gameId);

			if (!gameInfo) {
				return {
					success: false,
					reason_code: "game_not_found",
					reason: "Game not found",
				};
			}

			const serverUtcNow = clock.now().getTime();

			const session = gameSessionRepository.getById(command.sessionId);

			if (!session) {
				logService.warning(`Session not found: ${command.sessionId}. Creating stale session...`);

				const clientUtcNow = command.clientUtcNow.getTime();
				const driftMs = clientUtcNow - serverUtcNow;
				const startTime = new Date(new Date(command.startTime).getTime() - driftMs);

				logService.info(
					`Calculated time drift between client (PlayAtlas Exporter) and server: ${driftMs}ms`,
				);

				const stale = gameSessionFactory.createStale({
					sessionId: command.sessionId,
					gameId: gameInfo.id,
					gameName: gameInfo.name,
					startTime: startTime,
				});
				gameSessionRepository.add(stale);

				logService.info(`Created stale session ${command.sessionId} for ${gameInfo.name}`);

				eventBus.emit({
					id: crypto.randomUUID(),
					name: "staled-game-session",
					occurredAt: new Date(serverUtcNow),
					payload: { gameId: gameInfo.id, sessionId: command.sessionId },
				});

				return {
					success: true,
					reason_code: "stale_game_session_created",
					reason: "Stale game session created",
				};
			}

			if (session.isStale()) {
				return {
					success: true,
					reason_code: "game_session_is_already_stale",
					reason: "Game session is already stale",
				};
			}

			if (session.isClosed()) {
				return {
					success: false,
					reason_code: "cannot_stale_closed_game_session",
					reason: "Cannot stale closed game session",
				};
			}

			session.stale();

			gameSessionRepository.update(session);

			logService.info(`Staled session ${session.getSessionId()}`);

			eventBus.emit({
				id: crypto.randomUUID(),
				name: "staled-game-session",
				occurredAt: new Date(serverUtcNow),
				payload: { gameId: gameInfo.id, sessionId: session.getSessionId() },
			});

			return {
				success: true,
				reason_code: "staled_in_progress_game_session",
				reason: "Staled in progress game session",
			};
		},
	};
};
