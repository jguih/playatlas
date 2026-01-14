import type { Company } from "../../domain/company.entity";

export type SyncCompaniesCommand = {
	companies: Company | Company[];
};
