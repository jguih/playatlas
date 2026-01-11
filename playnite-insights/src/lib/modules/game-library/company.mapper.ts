import type { CompanyResponseDto } from '@playatlas/game-library/dtos';
import type { IClientEntityMapper } from '../common/common';
import type { Company } from './domain';

export const companyMapper: IClientEntityMapper<Company, CompanyResponseDto> = {
	toDomain: (dto) => {
		return {
			...dto,
			SourceUpdatedAt: new Date(),
		};
	},
};
