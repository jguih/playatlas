import type { ICommandHandlerPort } from "@playatlas/common/common";
import { makeClosedGameSession } from "../../domain/game-session.entity";
import type { CloseGameSessionCommand } from "./close-session.command";
import type {
	CloseGameSessionCommandResult,
	CloseGameSessionServiceDeps,
} from "./close-session.types";

export type ICloseGameSessionCommandHandlerPort = ICommandHandlerPort<
	CloseGameSessionCommand,
	CloseGameSessionCommandResult
>;

export const makeCloseGameSessionCommandHandler = ({
	gameSessionRepository,
	logService,
	gameInfoProvider,
	eventBus,
	clock,
}: CloseGameSessionServiceDeps): ICloseGameSessionCommandHandlerPort => {
	return {
		execute: (command: CloseGameSessionCommand): CloseGameSessionCommandResult => {
			const gameInfo = gameInfoProvider.getGameInfo(command.gameId);

			if (!gameInfo) {
				return {
					success: false,
					reason_code: "game_not_found",
					reason: "Game not found",
				};
			}

			const session = gameSessionRepository.getById(command.sessionId);
			const serverUtcNow = clock.now().getTime();

			if (!session) {
				logService.warning(`Session not found: ${command.sessionId}. Creating closed session...`);

				const clientUtcNow = command.clientUtcNow.getTime();
				const driftMs = clientUtcNow - serverUtcNow;
				const startTime = new Date(new Date(command.startTime).getTime() - driftMs);
				const endTime = new Date(new Date(command.endTime).getTime() - driftMs);

				logService.info(
					`Calculated time drift between client (PlayAtlas Exporter) and server: ${driftMs}ms`,
				);

				const closed = makeClosedGameSession({
					sessionId: command.sessionId,
					gameId: command.gameId,
					gameName: gameInfo.name,
					startTime: startTime,
					endTime: endTime,
					duration: command.duration,
				});
				gameSessionRepository.add(closed);

				logService.info(`Created closed session ${command.sessionId} for ${gameInfo.name}`);

				eventBus.emit({
					id: crypto.randomUUID(),
					name: "closed-game-session",
					occurredAt: new Date(serverUtcNow),
					payload: { gameId: command.gameId, sessionId: closed.getSessionId() },
				});

				return {
					success: true,
					reason_code: "closed_game_session_created",
					reason: "Created new closed game session",
				};
			}

			if (session.getStatus() === "closed") {
				return {
					success: true,
					reason_code: "game_session_is_already_closed",
					reason: "Game session is already closed",
				};
			}

			session.close({
				endTime: new Date(serverUtcNow),
				duration: command.duration,
			});

			gameSessionRepository.update(session);

			logService.info(`Closed in progress session ${session.getSessionId()}`);

			eventBus.emit({
				id: crypto.randomUUID(),
				name: "closed-game-session",
				occurredAt: new Date(serverUtcNow),
				payload: { gameId: command.gameId, sessionId: session.getSessionId() },
			});

			return {
				success: true,
				reason_code: "closed_in_progress_game_session",
				reason: "Closed in progress game session",
			};
		},
	};
};
