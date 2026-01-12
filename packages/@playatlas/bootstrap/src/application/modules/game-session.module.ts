import { LogServiceFactory } from "@playatlas/common/application";
import { BaseRepositoryDeps } from "@playatlas/common/infra";
import { IGameRepositoryPort } from "@playatlas/game-library/infra";
import {
  makeCloseGameSessionCommandHandler,
  makeOpenGameSessionCommandHandler,
  makeStaleGameSessionCommandHandler,
} from "@playatlas/game-session/commands";
import { makeGameSessionRepository } from "@playatlas/game-session/infra";
import { IGameSessionModulePort } from "./game-session.module.port";

export type GameSessionModuleDeps = {
  getDb: BaseRepositoryDeps["getDb"];
  logServiceFactory: LogServiceFactory;
  gameRepository: IGameRepositoryPort;
};

export const makeGameSessionModule = ({
  getDb,
  logServiceFactory,
  gameRepository,
}: GameSessionModuleDeps): IGameSessionModulePort => {
  const _game_session_repo = makeGameSessionRepository({
    getDb,
    logService: logServiceFactory.build("GameSessionRepository"),
  });

  const _open_game_session_command_handler = makeOpenGameSessionCommandHandler({
    gameSessionRepository: _game_session_repo,
    gameInfoProvider: {
      getGameName: (id) => gameRepository.getById(id)?.getName(),
    },
    logService: logServiceFactory.build("OpenGameSessionCommandHandler"),
  });

  const _close_game_session_command_handler =
    makeCloseGameSessionCommandHandler({
      gameSessionRepository: _game_session_repo,
      gameInfoProvider: {
        getGameName: (id) => gameRepository.getById(id)?.getName(),
      },
      logService: logServiceFactory.build("CloseGameSessionCommandHandler"),
    });

  const _stale_game_session_command_handler =
    makeStaleGameSessionCommandHandler({
      gameSessionRepository: _game_session_repo,
      gameInfoProvider: {
        getGameName: (id) => gameRepository.getById(id)?.getName(),
      },
      logService: logServiceFactory.build("StaleGameSessionCommandHandler"),
    });

  const gameSession: IGameSessionModulePort = {
    getGameSessionRepository: () => _game_session_repo,
    commands: {
      getCloseGameSessionCommandHandler: () =>
        _close_game_session_command_handler,
      getOpenGameSessionCommandHandler: () =>
        _open_game_session_command_handler,
      getStaleGameSessionCommandHandler: () =>
        _stale_game_session_command_handler,
    },
  };
  return Object.freeze(gameSession);
};
