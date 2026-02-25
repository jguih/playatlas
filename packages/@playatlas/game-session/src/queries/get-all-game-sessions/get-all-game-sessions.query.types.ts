import type { ILogServicePort } from "@playatlas/common/application";
import type { IClockPort, SyncCursor } from "@playatlas/common/infra";
import type { IGameSessionMapperPort } from "../../application";
import type { GameSessionResponseDto } from "../../dtos/game-session.response.dto";
import type { IGameSessionRepositoryPort } from "../../infra";

export type GetAllGameSessionsQueryHandlerDeps = {
	gameSessionRepository: IGameSessionRepositoryPort;
	gameSessionMapper: IGameSessionMapperPort;
	logService: ILogServicePort;
	clock: IClockPort;
};

export type GetAllGameSessionsQueryResult = {
	data: GameSessionResponseDto[];
	nextCursor: SyncCursor;
};
