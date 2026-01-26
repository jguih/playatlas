import type { ILogServicePort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import type { ICompanyMapperPort } from "../../application";
import type { CompanyResponseDto } from "../../dtos/company.response.dto";
import type { ICompanyRepositoryPort } from "../../infra";

export type GetAllCompaniesQueryHandlerDeps = {
	companyRepository: ICompanyRepositoryPort;
	companyMapper: ICompanyMapperPort;
	logService: ILogServicePort;
	clock: IClockPort;
};

export type GetAllCompaniesQueryResult = {
	nextCursor: string;
	data: CompanyResponseDto[];
};
