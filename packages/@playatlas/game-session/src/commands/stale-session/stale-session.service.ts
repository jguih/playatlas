import type { ILogServicePort } from "@playatlas/common/application";
import type { CommandHandler } from "@playatlas/common/common";
import { makeStaleGameSession } from "../../domain/game-session.entity";
import type { IGameSessionRepositoryPort } from "../../infra/game-session.repository.port";
import type { GameInfoProvider } from "../../types/game-info-provider";
import { StaleGameSessionCommand } from "./stale-session.command";

export type StaleGameSessionServiceDeps = {
  gameSessionRepository: IGameSessionRepositoryPort;
  logService: ILogServicePort;
  gameInfoProvider: GameInfoProvider;
};

export type StaleGameSessionServiceResult = {
  created: boolean;
  closed: boolean;
};

export type IStaleGameSessionCommandHandlerPort = CommandHandler<
  StaleGameSessionCommand,
  StaleGameSessionServiceResult
>;

export const makeStaleGameSessionCommandHandler = ({
  gameSessionRepository,
  logService,
  gameInfoProvider,
}: StaleGameSessionServiceDeps): IStaleGameSessionCommandHandlerPort => {
  return {
    execute: (
      command: StaleGameSessionCommand
    ): StaleGameSessionServiceResult => {
      const session = gameSessionRepository.getById(command.sessionId);
      const serverUtcNow = Date.now();
      const gameName = gameInfoProvider.getGameInfo(command.gameId);

      if (!session) {
        logService.warning(
          `Session not found: ${command.sessionId}. Creating stale session...`
        );

        const clientUtcNow = command.clientUtcNow.getTime();
        const driftMs = clientUtcNow - serverUtcNow;
        const startTime = new Date(
          new Date(command.startTime).getTime() - driftMs
        );

        logService.info(
          `Calculated time drift between client (PlayAtlas Exporter) and server: ${driftMs}ms`
        );

        const stale = makeStaleGameSession({
          sessionId: command.sessionId,
          gameId: command.gameId,
          gameName: gameName,
          startTime: startTime,
        });
        gameSessionRepository.add(stale);

        logService.info(
          `Created closed session ${command.sessionId} for ${gameName}`
        );
        return { created: true, closed: false };
      }

      session.stale();

      gameSessionRepository.update(session);
      logService.info(`Closed session ${session.getSessionId()}`);
      return { created: false, closed: true };
    },
  };
};
