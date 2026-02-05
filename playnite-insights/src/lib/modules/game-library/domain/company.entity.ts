import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";

export type CompanyId = string & { readonly __brand: "CompanyId" };

export const CompanyIdParser = {
	fromTrusted: (value: string) => value as CompanyId,
};

export type Company = ClientEntity<CompanyId> &
	Readonly<{
		Name: string;
		// Front-end specific
		Sync: EntitySyncStateProps;
	}>;
