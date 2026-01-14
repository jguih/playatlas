import type { ClientEntity } from "$lib/modules/common/common";

export type CompanyId = string;
export type Company = ClientEntity<CompanyId> & {
	Name: string;
};
