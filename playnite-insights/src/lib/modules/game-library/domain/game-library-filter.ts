import type { ClientEntity } from "$lib/modules/common/common";
import type { GetGamesQueryFilter, GetGamesQuerySort } from "$lib/modules/common/queries";

export type GameLibraryFilterId = string & { readonly __brand: "GameLibraryFilterId" };

export const GameLibraryFilterIdParser = {
	fromTrusted: (value: string) => value as GameLibraryFilterId,
};

export type GameLibraryFilterQuery = {
	Sort: GetGamesQuerySort;
	Filter: GetGamesQueryFilter | null;
};

export type GameLibraryFilter = ClientEntity<GameLibraryFilterId> & {
	Query: GameLibraryFilterQuery;
	QueryVersion: number;
	Hash: string;
	LastUsedAt: Date;
	UseCount: number;
};
