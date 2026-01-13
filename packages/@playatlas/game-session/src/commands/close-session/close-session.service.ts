import type { ILogServicePort } from "@playatlas/common/application";
import type { CommandHandler } from "@playatlas/common/common";
import { makeClosedGameSession } from "../../domain/game-session.entity";
import type { IGameSessionRepositoryPort } from "../../infra/game-session.repository.port";
import type { GameInfoProvider } from "../../types/game-info-provider";
import type { CloseGameSessionCommand } from "./close-session.command";

export type CloseGameSessionServiceDeps = {
  gameSessionRepository: IGameSessionRepositoryPort;
  logService: ILogServicePort;
  gameInfoProvider: GameInfoProvider;
};

export type CloseGameSessionServiceResult = {
  created: boolean;
  closed: boolean;
};

export type ICloseGameSessionCommandHandlerPort = CommandHandler<
  CloseGameSessionCommand,
  CloseGameSessionServiceResult
>;

export const makeCloseGameSessionCommandHandler = ({
  gameSessionRepository,
  logService,
  gameInfoProvider,
}: CloseGameSessionServiceDeps): ICloseGameSessionCommandHandlerPort => {
  return {
    execute: (
      command: CloseGameSessionCommand
    ): CloseGameSessionServiceResult => {
      const session = gameSessionRepository.getById(command.sessionId);
      const serverUtcNow = Date.now();
      const gameName = gameInfoProvider.getGameInfo(command.gameId);

      if (!session) {
        logService.warning(
          `Session not found: ${command.sessionId}. Creating closed session...`
        );

        const clientUtcNow = command.clientUtcNow.getTime();
        const driftMs = clientUtcNow - serverUtcNow;
        const startTime = new Date(
          new Date(command.startTime).getTime() - driftMs
        );
        const endTime = new Date(new Date(command.endTime).getTime() - driftMs);

        logService.info(
          `Calculated time drift between client (PlayAtlas Exporter) and server: ${driftMs}ms`
        );

        const closed = makeClosedGameSession({
          sessionId: command.sessionId,
          gameId: command.gameId,
          gameName: gameName,
          startTime: startTime,
          endTime: endTime,
          duration: command.duration,
        });
        gameSessionRepository.add(closed);

        logService.info(
          `Created closed session ${command.sessionId} for ${gameName}`
        );
        return { created: true, closed: false };
      }

      session.close({
        endTime: new Date(serverUtcNow),
        duration: command.duration,
      });

      gameSessionRepository.update(session);
      logService.info(`Closed session ${session.getSessionId()}`);
      return { created: false, closed: true };
    },
  };
};
