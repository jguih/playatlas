import type { IDomainEventBusPort, ILogServiceFactoryPort } from "@playatlas/common/application";
import { GameIdParser } from "@playatlas/common/domain";
import type { BaseRepositoryDeps, IClockPort } from "@playatlas/common/infra";
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
	logServiceFactory: ILogServiceFactoryPort;
	gameRepository: IGameRepositoryPort;
	eventBus: IDomainEventBusPort;
	clock: IClockPort;
};

export const makeGameSessionModule = ({
	getDb,
	logServiceFactory,
	gameRepository,
	eventBus,
	clock,
}: GameSessionModuleDeps): IGameSessionModulePort => {
	const gameSessionRepository = makeGameSessionRepository({
		getDb,
		logService: logServiceFactory.build("GameSessionRepository"),
	});

	const gameInfoProvider: GameInfoProvider = {
		getGameInfo: (id) => {
			const game = gameRepository.getById(GameIdParser.fromExternal(id));
			return game ? { name: game.getPlayniteSnapshot().name } : null;
		},
	};

	const openGameSessionCommandHandler = makeOpenGameSessionCommandHandler({
		gameSessionRepository: gameSessionRepository,
		gameInfoProvider,
		logService: logServiceFactory.build("OpenGameSessionCommandHandler"),
		eventBus,
		clock,
	});

	const closeGameSessionCommandHandler = makeCloseGameSessionCommandHandler({
		gameSessionRepository: gameSessionRepository,
		gameInfoProvider,
		logService: logServiceFactory.build("CloseGameSessionCommandHandler"),
		eventBus,
		clock,
	});

	const staleGameSessionCommandHandler = makeStaleGameSessionCommandHandler({
		gameSessionRepository: gameSessionRepository,
		gameInfoProvider,
		logService: logServiceFactory.build("StaleGameSessionCommandHandler"),
		eventBus,
		clock,
	});

	const gameSession: IGameSessionModulePort = {
		getGameSessionRepository: () => gameSessionRepository,
		commands: {
			getCloseGameSessionCommandHandler: () => closeGameSessionCommandHandler,
			getOpenGameSessionCommandHandler: () => openGameSessionCommandHandler,
			getStaleGameSessionCommandHandler: () => staleGameSessionCommandHandler,
		},
	};
	return Object.freeze(gameSession);
};
