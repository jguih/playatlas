import type { CompanyId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Company } from "../domain/company.entity";

export type ICompanyRepositoryPort = IEntityRepositoryPort<CompanyId, Company> & {};
