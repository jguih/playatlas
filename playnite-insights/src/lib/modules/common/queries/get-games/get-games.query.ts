export type GetGamesQueryFilter = {
	installed?: boolean;
	search?: string;
};

export type GetGamesQuerySort = "recent" | "name";

export type GetGamesQuery = {
	sort: GetGamesQuerySort;
	filter?: GetGamesQueryFilter;
	cursor?: IDBValidKey | null;
	limit: number;
};
