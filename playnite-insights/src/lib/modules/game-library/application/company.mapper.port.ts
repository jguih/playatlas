import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { CompanyResponseDto } from "@playatlas/game-library/dtos";
import type { Company } from "../domain/company.entity";

export type ICompanyMapperPort = IClientEntityMapper<Company, CompanyResponseDto>;
