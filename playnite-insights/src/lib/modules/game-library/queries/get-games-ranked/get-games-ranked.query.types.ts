import type { Game } from "../../domain/game.entity";

export type GetGamesRankedQueryResult = {
	games: Game[];
	nextKey: number | null;
};
