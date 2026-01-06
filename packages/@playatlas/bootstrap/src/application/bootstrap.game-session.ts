import { LogServiceFactory } from "@playatlas/common/application";
import { BaseRepositoryDeps } from "@playatlas/common/infra";
import { GameRepository } from "@playatlas/game-library/infra";
import {
  makeCloseGameSessionCommandHandler,
  makeOpenGameSessionCommandHandler,
  type CloseGameSessionCommandHandler,
  type OpenGameSessionCommandHandler,
} from "@playatlas/game-session/commands";
import {
  GameSessionRepository,
  makeGameSessionRepository,
} from "@playatlas/game-session/infra";

export type PlayAtlasApiGameSession = {
  /**
   * UNSAFE — low-level access intended for testing and infrastructure only.
   *
   * @deprecated Do not use in application code. Intended for tests/bootstrap only.
   */
  unsafe: {
    getGameSessionRepository: () => GameSessionRepository;
  };
  commands: {
    getOpenGameSessionCommandHandler: () => OpenGameSessionCommandHandler;
    getCloseGameSessionCommandHandler: () => CloseGameSessionCommandHandler;
  };
};

export type BootstrapGameSessionDeps = {
  getDb: BaseRepositoryDeps["getDb"];
  logServiceFactory: LogServiceFactory;
  gameRepository: GameRepository;
};

export const bootstrapGameSession = ({
  getDb,
  logServiceFactory,
  gameRepository,
}: BootstrapGameSessionDeps): PlayAtlasApiGameSession => {
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

  const gameSession: PlayAtlasApiGameSession = {
    unsafe: {
      getGameSessionRepository: () => _game_session_repo,
    },
    commands: {
      getCloseGameSessionCommandHandler: () =>
        _close_game_session_command_handler,
      getOpenGameSessionCommandHandler: () =>
        _open_game_session_command_handler,
    },
  };
  return Object.freeze(gameSession);
};
