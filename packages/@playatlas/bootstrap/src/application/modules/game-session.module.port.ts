import type {
	ICloseGameSessionCommandHandlerPort,
	IOpenGameSessionCommandHandlerPort,
	IStaleGameSessionCommandHandlerPort,
} from "@playatlas/game-session/commands";
import type { IGameSessionRepositoryPort } from "@playatlas/game-session/infra";

export type IGameSessionModulePort = {
	getGameSessionRepository: () => IGameSessionRepositoryPort;
	commands: {
		getOpenGameSessionCommandHandler: () => IOpenGameSessionCommandHandlerPort;
		getCloseGameSessionCommandHandler: () => ICloseGameSessionCommandHandlerPort;
		getStaleGameSessionCommandHandler: () => IStaleGameSessionCommandHandlerPort;
	};
};
