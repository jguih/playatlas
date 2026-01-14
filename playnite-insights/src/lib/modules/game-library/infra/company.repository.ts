import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { Company, CompanyId } from "../domain/company.entity";
import type { ICompanyRepositoryPort } from "./company.repository.port";
import { companyRepositoryMeta } from "./company.repository.schema";

export type CompanyRepositoryDeps = ClientEntityRepositoryDeps;

export class CompanyRepository
	extends ClientEntityRepository<Company, CompanyId>
	implements ICompanyRepositoryPort
{
	constructor({ indexedDbSignal }: CompanyRepositoryDeps) {
		super({ indexedDbSignal, storeName: companyRepositoryMeta.storeName });
	}
}
