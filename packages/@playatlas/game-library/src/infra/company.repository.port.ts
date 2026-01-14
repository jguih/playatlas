import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Company, CompanyId } from "../domain/company.entity";

export type ICompanyRepositoryPort = IEntityRepositoryPort<CompanyId, Company> & {};
