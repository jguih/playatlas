export type GetGamesQueryFilter = {
	installed?: boolean;
	search?: string;
};

export type GetGamesQuerySortDirection = "asc" | "desc";

export type GetGamesQuerySort =
	| { type: "recent"; direction?: GetGamesQuerySortDirection }
	| { type: "name"; direction?: GetGamesQuerySortDirection }
	| { type: "playtime"; direction?: GetGamesQuerySortDirection };

export type GetGamesQuery = {
	sort: GetGamesQuerySort;
	filter?: GetGamesQueryFilter;
	cursor?: IDBValidKey | null;
	limit: number;
};
