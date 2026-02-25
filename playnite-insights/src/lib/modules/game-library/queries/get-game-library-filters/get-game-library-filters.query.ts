import type { GameLibraryFilter } from "../../domain/game-library-filter";

export type GetGameLibraryFiltersQuery = {
	sort: "recentlyUsed";
	sortOrder: "desc";
};

export type GetGameLibraryFiltersQueryResult = {
	gameLibraryFilters: GameLibraryFilter[];
};
