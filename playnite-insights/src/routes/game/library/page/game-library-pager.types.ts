import type { GetGamesQueryFilter, GetGamesQuerySort } from "$lib/modules/common/queries";

export type GameLibraryPagerLoadMoreProps = {
	sort?: GetGamesQuerySort;
	filter?: GetGamesQueryFilter;
};
