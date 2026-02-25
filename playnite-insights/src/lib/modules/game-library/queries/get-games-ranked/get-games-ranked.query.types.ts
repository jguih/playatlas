import type { Game } from "../../domain/game.entity";

export type ExpandedGame = Game & {
	Synergy: number;
};

export type GetGamesRankedQueryResult = {
	games: ExpandedGame[];
	nextKey: number | null;
};
