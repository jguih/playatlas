import { GameResponseDto } from "../../dtos/game.response.dto";
import { type IGameRepositoryPort } from "../../infra/game.repository.port";

export type GetAllGamesQueryHandlerDeps = {
  gameRepository: IGameRepositoryPort;
};

export type GetAllGamesQueryResult =
  | { type: "not_modified" }
  | { type: "ok"; data: GameResponseDto[]; etag: string };
