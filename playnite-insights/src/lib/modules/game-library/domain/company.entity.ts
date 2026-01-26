import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";

export type CompanyId = string;
export type Company = ClientEntity<CompanyId> & {
	Name: string;
	// Front-end specific
	Sync: EntitySyncStateProps;
};
