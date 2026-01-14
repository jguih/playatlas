import type { ClientEntity } from "$lib/modules/common/common";

export type PlatformId = string;
export type Platform = ClientEntity<PlatformId> & {
	Name: string;
	SpecificationId: string;
	Icon: string | null;
	Cover: string | null;
	Background: string | null;
};
