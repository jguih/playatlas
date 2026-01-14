import type { ILogServicePort } from "@playatlas/common/application";
import type { CloseGameSessionCommand } from "../commands/close-session/close-session.command";
import type { OpenGameSessionCommand } from "../commands/open-session/open-session.command";
import type { IGameSessionRepositoryPort } from "../infra/game-session.repository.port";
import type { GameSession } from "./game-session.entity";

export type GameSessionService = {
	open: (args: OpenGameSessionCommand) => boolean;
	close: (args: CloseGameSessionCommand) => boolean;
	getRecent: () => GameSession[] | null;
};

export type GameSessionServiceDeps = {
	logService: ILogServicePort;
	gameSessionRepository: IGameSessionRepositoryPort;
};
