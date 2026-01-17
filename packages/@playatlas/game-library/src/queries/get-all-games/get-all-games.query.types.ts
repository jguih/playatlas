import type { IGameMapperPort } from "../../application";
import type { PlayniteProjectionResponseDto } from "../../dtos/game.response.dto";
import { type IGameRepositoryPort } from "../../infra/game.repository.port";

export type GetAllGamesQueryHandlerDeps = {
	gameRepository: IGameRepositoryPort;
	gameMapper: IGameMapperPort;
};

export type GetAllGamesQueryResult =
	| { type: "not_modified" }
	| { type: "ok"; data: PlayniteProjectionResponseDto[]; etag: string };
