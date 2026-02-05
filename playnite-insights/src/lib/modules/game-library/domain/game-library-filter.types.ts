import type { GetGamesQueryFilter, GetGamesQuerySort } from "$lib/modules/common/queries";
import type { GameLibraryFilterId } from "./value-object";

type StoredGameLibraryFilter = GetGamesQueryFilter & {
	searchNormalized?: string;
};

export type GameLibraryFilterAggregateQuery = {
	sort: GetGamesQuerySort;
	filter: StoredGameLibraryFilter | null;
};

export type CreateGameLibraryFilterProps = {
	id: GameLibraryFilterId;
	sourceLastUpdatedAt: Date;
	query: GameLibraryFilterAggregateQuery;
	queryVersion: number;
	key: string;
	lastUsedAt: Date;
	useCount: number | null;
};
