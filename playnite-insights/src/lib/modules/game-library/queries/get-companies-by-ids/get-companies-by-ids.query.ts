import type { Company, CompanyId } from '../../domain/company.entity';

export type GetCompaniesByIdsQuery = {
	companyIds: CompanyId[];
};

export type GetCompaniesByIdsQueryResult = {
	companies: Company[];
};
