import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";

export type PlatformId = string & { readonly __brand: "PlatformId" };

export const PlatformIdParser = {
	fromTrusted: (value: string) => value as PlatformId,
};

export type Platform = ClientEntity<PlatformId> & {
	Name: string;
	SpecificationId: string;
	Icon: string | null;
	Cover: string | null;
	Background: string | null;
	// Front-end specific
	Sync: EntitySyncStateProps;
};
