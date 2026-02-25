import type { SortDirection } from "../../domain";

export type GetGamesQueryFilter = {
	search?: string;
	horror?: boolean;
};

type GetGamesQuerySortType = "recentlyUpdated" | "name" | "playtime";

export type GetGamesQuerySort = { type: GetGamesQuerySortType; direction?: SortDirection };

export type GetGamesQuery = {
	sort: GetGamesQuerySort;
	filter?: GetGamesQueryFilter;
	cursor?: IDBValidKey | null;
	limit: number;
};
