import type { IDomainEventBusPort, ILogServiceFactoryPort } from "@playatlas/common/application";
import type { BaseRepositoryDeps, IClockPort } from "@playatlas/common/infra";
import type { IGameRepositoryPort } from "@playatlas/game-library/infra";
import { makeGameSessionFactory, makeGameSessionMapper } from "@playatlas/game-session/application";
import {
	makeCloseGameSessionCommandHandler,
	makeOpenGameSessionCommandHandler,
	makeStaleGameSessionCommandHandler,
} from "@playatlas/game-session/commands";
import { makeGameSessionRepository } from "@playatlas/game-session/infra";
import { makeGetAllGameSessionsQueryHandler } from "@playatlas/game-session/queries";
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
	const buildLog = (ctx: string) => logServiceFactory.build(ctx);

	const gameSessionFactory = makeGameSessionFactory({ clock });
	const gameSessionMapper = makeGameSessionMapper({ gameSessionFactory });
	const gameSessionRepository = makeGameSessionRepository({
		getDb,
		logService: buildLog("GameSessionRepository"),
		gameSessionMapper,
	});

	const gameInfoProvider: GameInfoProvider = {
		getGameInfo: (id) => {
			const game = gameRepository.getByPlayniteId(id);
			if (!game) return null;

			const snapshot = game.getPlayniteSnapshot();
			return { name: snapshot?.name ?? null, id: game.getId() };
		},
	};

	const getAllGameSessionsQueryHandler = makeGetAllGameSessionsQueryHandler({
		clock,
		logService: buildLog("GetAllGameSessionsQueryHandler"),
		gameSessionMapper,
		gameSessionRepository,
	});

	const openGameSessionCommandHandler = makeOpenGameSessionCommandHandler({
		gameSessionRepository: gameSessionRepository,
		gameInfoProvider,
		logService: buildLog("OpenGameSessionCommandHandler"),
		eventBus,
		clock,
		gameSessionFactory,
	});

	const closeGameSessionCommandHandler = makeCloseGameSessionCommandHandler({
		gameSessionRepository: gameSessionRepository,
		gameInfoProvider,
		logService: buildLog("CloseGameSessionCommandHandler"),
		eventBus,
		clock,
		gameSessionFactory,
	});

	const staleGameSessionCommandHandler = makeStaleGameSessionCommandHandler({
		gameSessionRepository: gameSessionRepository,
		gameInfoProvider,
		logService: buildLog("StaleGameSessionCommandHandler"),
		eventBus,
		clock,
		gameSessionFactory,
	});

	const gameSession: IGameSessionModulePort = {
		getGameSessionFactory: () => gameSessionFactory,
		getGameSessionMapper: () => gameSessionMapper,
		getGameSessionRepository: () => gameSessionRepository,
		commands: {
			getCloseGameSessionCommandHandler: () => closeGameSessionCommandHandler,
			getOpenGameSessionCommandHandler: () => openGameSessionCommandHandler,
			getStaleGameSessionCommandHandler: () => staleGameSessionCommandHandler,
		},
		queries: {
			getGetAllGameSessionsQueryHandler: () => getAllGameSessionsQueryHandler,
		},
	};
	return Object.freeze(gameSession);
};
