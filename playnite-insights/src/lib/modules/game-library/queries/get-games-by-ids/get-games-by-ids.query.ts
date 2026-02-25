import type { Game, GameId } from "../../domain/game.entity";

export type GetGamesByIdsQuery = {
	gameIds: GameId[];
};

export type GetGamesByIdsQueryResult = {
	games: Game[];
};
