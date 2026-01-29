import { type EntityMapper } from "@playatlas/common/application";
import { CompanyIdParser, PlayniteCompanyIdParser } from "@playatlas/common/domain";
import { type Company } from "../domain/company.entity";
import type { CompanyResponseDto } from "../dtos";
import type { CompanyModel } from "../infra/company.repository";
import type { ICompanyFactoryPort } from "./company.factory";

export type ICompanyMapperPort = EntityMapper<Company, CompanyModel, CompanyResponseDto>;

export type CompanyMapperDeps = {
	companyFactory: ICompanyFactoryPort;
};

export const makeCompanyMapper = ({ companyFactory }: CompanyMapperDeps): ICompanyMapperPort => {
	const _toDto = (entity: Company): CompanyResponseDto => {
		const dto: CompanyResponseDto = {
			Id: entity.getId(),
			Name: entity.getName(),
			Sync: {
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				DeletedAt: entity.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: entity.getDeleteAfter()?.toISOString() ?? null,
			},
		};
		return dto;
	};

	return {
		toPersistence: (company: Company): CompanyModel => {
			const record: CompanyModel = {
				Id: company.getId(),
				PlayniteId: company.getPlayniteId(),
				Name: company.getName(),
				LastUpdatedAt: company.getLastUpdatedAt().toISOString(),
				CreatedAt: company.getCreatedAt().toISOString(),
				DeletedAt: company.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: company.getDeleteAfter()?.toISOString() ?? null,
			};
			return record;
		},
		toDomain: (record: CompanyModel): Company => {
			const entity: Company = companyFactory.rehydrate({
				id: CompanyIdParser.fromTrusted(record.Id),
				playniteId: record.PlayniteId
					? PlayniteCompanyIdParser.fromTrusted(record.PlayniteId)
					: null,
				name: record.Name,
				lastUpdatedAt: new Date(record.LastUpdatedAt),
				createdAt: new Date(record.CreatedAt),
				deletedAt: record.DeletedAt ? new Date(record.DeletedAt) : undefined,
				deleteAfter: record.DeleteAfter ? new Date(record.DeleteAfter) : undefined,
			});
			return entity;
		},
		toDto: _toDto,
		toDtoList: (entities) => {
			return entities.map(_toDto);
		},
	};
};
