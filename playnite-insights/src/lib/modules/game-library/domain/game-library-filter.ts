import type { ClientEntity } from "$lib/modules/common/common";
import type { GetGamesQuery } from "$lib/modules/common/queries";

export type GameLibraryFilterId = string & { readonly __brand: "GameLibraryFilterId" };

export const GameLibraryFilterIdParser = {
	fromTrusted: (value: string) => value as GameLibraryFilterId,
};

export type GameLibraryFilter = ClientEntity<GameLibraryFilterId> & {
	Query: GetGamesQuery;
	QueryVersion: number;
	Hash: string;
	LastUsedAt: Date;
	UseCount: number;
};
