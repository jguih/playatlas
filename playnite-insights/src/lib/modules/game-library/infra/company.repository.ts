import type { SyncStatus } from "$lib/modules/common/common";
import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { ICompanyMapperPort } from "../application/company.mapper.port";
import type { Company, CompanyId } from "../domain/company.entity";
import type { ICompanyRepositoryPort } from "./company.repository.port";
import { companyRepositoryMeta } from "./company.repository.schema";

export type CompanyRepositoryDeps = ClientEntityRepositoryDeps & {
	companyMapper: ICompanyMapperPort;
};

export type CompanyModel = {
	Id: CompanyId;
	Name: string;
	SourceLastUpdatedAt: Date;
	SourceLastUpdatedAtMs: number;
	DeletedAt?: Date | null;
	DeleteAfter?: Date | null;

	Sync: {
		Status: SyncStatus;
		ErrorMessage?: string | null;
		LastSyncedAt: Date;
	};
};

export class CompanyRepository
	extends ClientEntityRepository<CompanyId, Company, CompanyModel>
	implements ICompanyRepositoryPort
{
	constructor({ dbSignal, companyMapper }: CompanyRepositoryDeps) {
		super({ dbSignal, storeName: companyRepositoryMeta.storeName, mapper: companyMapper });
	}
}
