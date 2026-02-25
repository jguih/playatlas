import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";

export type GenreId = string & { readonly __band: "GenreId" };

export const GenreIdParser = {
	fromTrusted: (value: string): GenreId => value as GenreId,
};

export type Genre = ClientEntity<GenreId> &
	Readonly<{
		Name: string;
		// Front-end specific
		Sync: EntitySyncStateProps;
	}>;
