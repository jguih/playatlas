import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";

export type PlatformId = string & { readonly __brand: "PlatformId" };

export const PlatformIdParser = {
	fromTrusted: (value: string) => value as PlatformId,
};

export type PlaynitePlatformId = string & { readonly __brand: "PlaynitePlatformId" };

export const PlaynitePlatformIdParser = {
	fromTrusted: (value: string) => value as PlaynitePlatformId,
};

export type Platform = ClientEntity<PlatformId> & {
	Name: string;
	Playnite: {
		Id: PlaynitePlatformId | null;
		SpecificationId: string | null;
	};
	// Front-end specific
	Sync: EntitySyncStateProps;
};
