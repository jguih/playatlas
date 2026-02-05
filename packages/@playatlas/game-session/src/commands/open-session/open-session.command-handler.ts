import type { ICommandHandlerPort } from "@playatlas/common/application";
import { makeGameSession } from "../../domain/game-session.entity";
import { type OpenGameSessionCommand } from "./open-session.command";
import type {
	OpenGameSessionCommandResult,
	OpenGameSessionServiceDeps,
} from "./open-session.types";

export type IOpenGameSessionCommandHandlerPort = ICommandHandlerPort<
	OpenGameSessionCommand,
	OpenGameSessionCommandResult
>;

export const makeOpenGameSessionCommandHandler = ({
	gameSessionRepository: repository,
	gameInfoProvider,
	logService,
	eventBus,
	clock,
}: OpenGameSessionServiceDeps): IOpenGameSessionCommandHandlerPort => {
	return {
		execute: (command) => {
			const gameInfo = gameInfoProvider.getGameInfo(command.gameId);

			if (!gameInfo) {
				return {
					success: false,
					reason_code: "game_not_found",
					reason: "Game not found",
				};
			}

			const now = clock.now();

			const session = makeGameSession({
				sessionId: command.sessionId,
				startTime: now,
				gameId: gameInfo.id,
				gameName: gameInfo.name,
			});

			repository.add(session);

			logService.info(`Created open session ${command.sessionId} for ${gameInfo.name}`);

			eventBus.emit({
				id: crypto.randomUUID(),
				name: "opened-game-session",
				occurredAt: now,
				payload: { gameId: gameInfo.id, sessionId: session.getSessionId() },
			});

			return {
				success: true,
				reason_code: "opened_game_session_created",
				reason: "Opened game session created successfully",
			};
		},
	};
};
