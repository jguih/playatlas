import type { LogService } from "@playatlas/common/application";
import type { CommandHandler } from "@playatlas/common/common";
import { makeGameSession } from "../../domain/game-session.entity";
import type { GameSessionRepository } from "../../infra/game-session.repository.port";
import { type GameInfoProvider } from "../../types/game-info-provider";
import { type OpenGameSessionCommand } from "./open-session.command";

export type OpenGameSessionServiceDeps = {
  gameSessionRepository: GameSessionRepository;
  gameInfoProvider: GameInfoProvider;
  logService: LogService;
};

export type OpenGameSessionCommandHandler = CommandHandler<
  OpenGameSessionCommand,
  void
>;

export const makeOpenGameSessionCommandHandler = ({
  gameSessionRepository: repository,
  gameInfoProvider,
  logService,
}: OpenGameSessionServiceDeps): OpenGameSessionCommandHandler => {
  return {
    execute: (command: OpenGameSessionCommand): void => {
      const now = new Date();
      const gameName = gameInfoProvider.getGameName(command.gameId);

      const session = makeGameSession({
        sessionId: command.sessionId,
        startTime: now,
        gameId: command.gameId,
        gameName,
      });

      repository.add(session);

      logService.info(
        `Created open session ${command.sessionId} for ${gameName}`
      );
    },
  };
};
