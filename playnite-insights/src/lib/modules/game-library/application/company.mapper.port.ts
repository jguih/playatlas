import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { CompanyResponseDto } from "@playatlas/game-library/dtos";
import type { Company, CompanyId } from "../domain/company.entity";
import type { CompanyModel } from "../infra/company.repository";

export type ICompanyMapperPort = IClientEntityMapper<CompanyId, Company, CompanyModel> & {
	fromDto: (dto: CompanyResponseDto, lastSync?: Date | null) => Company;
};
