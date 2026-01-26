import type { ILogServicePort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import type { IGameMapperPort } from "../../application";
import type { PlayniteProjectionResponseDto } from "../../dtos/game.response.dto";
import { type IGameRepositoryPort } from "../../infra/game.repository.port";

export type GetAllGamesQueryHandlerDeps = {
	gameRepository: IGameRepositoryPort;
	gameMapper: IGameMapperPort;
	logService: ILogServicePort;
	clock: IClockPort;
};

export type GetAllGamesQueryResult = {
	data: PlayniteProjectionResponseDto[];
	nextCursor: string;
};
