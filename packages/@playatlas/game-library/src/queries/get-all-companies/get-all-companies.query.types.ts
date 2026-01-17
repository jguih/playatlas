import type { ICompanyMapperPort } from "../../application";
import type { CompanyResponseDto } from "../../dtos/company.response.dto";
import type { ICompanyRepositoryPort } from "../../infra";

export type GetAllCompaniesQueryHandlerDeps = {
	companyRepository: ICompanyRepositoryPort;
	companyMapper: ICompanyMapperPort;
};

export type GetAllCompaniesQueryResult =
	| { type: "not_modified" }
	| { type: "ok"; data: CompanyResponseDto[]; etag: string };
