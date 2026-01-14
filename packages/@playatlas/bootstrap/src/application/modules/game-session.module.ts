import type { IDomainEventBusPort, LogServiceFactory } from "@playatlas/common/application";
import type { BaseRepositoryDeps } from "@playatlas/common/infra";
import type { IGameRepositoryPort } from "@playatlas/game-library/infra";
import {
	makeCloseGameSessionCommandHandler,
	makeOpenGameSessionCommandHandler,
	makeStaleGameSessionCommandHandler,
} from "@playatlas/game-session/commands";
import { makeGameSessionRepository } from "@playatlas/game-session/infra";
import type { GameInfoProvider } from "@playatlas/game-session/types";
import type { IGameSessionModulePort } from "./game-session.module.port";

export type GameSessionModuleDeps = {
	getDb: BaseRepositoryDeps["getDb"];
	logServiceFactory: LogServiceFactory;
	gameRepository: IGameRepositoryPort;
	eventBus: IDomainEventBusPort;
};

export const makeGameSessionModule = ({
	getDb,
	logServiceFactory,
	gameRepository,
	eventBus,
}: GameSessionModuleDeps): IGameSessionModulePort => {
	const _game_session_repo = makeGameSessionRepository({
		getDb,
		logService: logServiceFactory.build("GameSessionRepository"),
	});

	const gameInfoProvider: GameInfoProvider = {
		getGameInfo: (id) => {
			const game = gameRepository.getById(id);
			return game ? { name: game.getName() } : null;
		},
	};

	const _open_game_session_command_handler = makeOpenGameSessionCommandHandler({
		gameSessionRepository: _game_session_repo,
		gameInfoProvider,
		logService: logServiceFactory.build("OpenGameSessionCommandHandler"),
		eventBus,
	});

	const _close_game_session_command_handler = makeCloseGameSessionCommandHandler({
		gameSessionRepository: _game_session_repo,
		gameInfoProvider,
		logService: logServiceFactory.build("CloseGameSessionCommandHandler"),
	});

	const _stale_game_session_command_handler = makeStaleGameSessionCommandHandler({
		gameSessionRepository: _game_session_repo,
		gameInfoProvider,
		logService: logServiceFactory.build("StaleGameSessionCommandHandler"),
	});

	const gameSession: IGameSessionModulePort = {
		getGameSessionRepository: () => _game_session_repo,
		commands: {
			getCloseGameSessionCommandHandler: () => _close_game_session_command_handler,
			getOpenGameSessionCommandHandler: () => _open_game_session_command_handler,
			getStaleGameSessionCommandHandler: () => _stale_game_session_command_handler,
		},
	};
	return Object.freeze(gameSession);
};
