import { type EntityMapper } from "@playatlas/common/application";
import { PlatformIdParser } from "@playatlas/common/domain";
import type { Platform } from "../domain/platform.entity";
import type { PlatformResponseDto } from "../dtos";
import type { PlatformModel } from "../infra/platform.repository";
import type { IPlatformFactoryPort } from "./platform.factory";

export type IPlatformMapperPort = EntityMapper<Platform, PlatformModel, PlatformResponseDto>;

export type PlatformMapperDeps = {
	platformFactory: IPlatformFactoryPort;
};

export const makePlatformMapper = ({
	platformFactory,
}: PlatformMapperDeps): IPlatformMapperPort => {
	const _toDto: IPlatformMapperPort["toDto"] = (entity) => {
		const dto: PlatformResponseDto = {
			Id: entity.getId(),
			Background: entity.getBackground(),
			Cover: entity.getCover(),
			Icon: entity.getIcon(),
			Name: entity.getName(),
			SpecificationId: entity.getSpecificationId(),
		};
		return dto;
	};

	return {
		toPersistence: (entity) => {
			const model: PlatformModel = {
				Id: entity.getId(),
				Name: entity.getName(),
				SpecificationId: entity.getSpecificationId(),
				Background: entity.getBackground(),
				Cover: entity.getCover(),
				Icon: entity.getIcon(),
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				CreatedAt: entity.getCreatedAt().toISOString(),
				DeletedAt: null,
				DeleteAfter: null,
			};
			return model;
		},
		toDomain: (model) => {
			const entity: Platform = platformFactory.rehydrate({
				id: PlatformIdParser.fromTrusted(model.Id),
				name: model.Name,
				specificationId: model.SpecificationId,
				background: model.Background,
				cover: model.Cover,
				icon: model.Icon,
				lastUpdatedAt: new Date(model.LastUpdatedAt),
				createdAt: new Date(model.CreatedAt),
				deletedAt: model.DeletedAt ? new Date(model.DeletedAt) : undefined,
				deleteAfter: model.DeleteAfter ? new Date(model.DeleteAfter) : undefined,
			});
			return entity;
		},
		toDto: _toDto,
		toDtoList: (entities) => {
			const dtos: PlatformResponseDto[] = [];
			for (const entity of entities) dtos.push(_toDto(entity));
			return dtos;
		},
	};
};
