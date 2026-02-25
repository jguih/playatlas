import type { IClientEntityRepository } from "$lib/modules/common/infra";
import type { Company, CompanyId } from "../domain/company.entity";

export type ICompanyRepositoryPort = IClientEntityRepository<Company, CompanyId>;
