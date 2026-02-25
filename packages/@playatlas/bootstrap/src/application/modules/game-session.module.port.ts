import type {
	IGameSessionFactoryPort,
	IGameSessionMapperPort,
} from "@playatlas/game-session/application";
import type {
	ICloseGameSessionCommandHandlerPort,
	IOpenGameSessionCommandHandlerPort,
	IStaleGameSessionCommandHandlerPort,
} from "@playatlas/game-session/commands";
import type { IGameSessionRepositoryPort } from "@playatlas/game-session/infra";
import type { IGetAllGameSessionsQueryHandlerPort } from "@playatlas/game-session/queries";

export type IGameSessionModulePort = {
	getGameSessionMapper: () => IGameSessionMapperPort;
	getGameSessionFactory: () => IGameSessionFactoryPort;
	getGameSessionRepository: () => IGameSessionRepositoryPort;
	commands: {
		getOpenGameSessionCommandHandler: () => IOpenGameSessionCommandHandlerPort;
		getCloseGameSessionCommandHandler: () => ICloseGameSessionCommandHandlerPort;
		getStaleGameSessionCommandHandler: () => IStaleGameSessionCommandHandlerPort;
	};
	queries: {
		getGetAllGameSessionsQueryHandler: () => IGetAllGameSessionsQueryHandlerPort;
	};
};
