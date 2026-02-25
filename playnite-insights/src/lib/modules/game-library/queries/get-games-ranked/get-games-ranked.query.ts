import type { GetGamesQueryFilter } from "$lib/modules/common/queries";

export type GetGamesRankedQuery = {
	limit: number;
	cursor?: number | null;
	filter?: GetGamesQueryFilter;
};
