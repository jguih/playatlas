import { type EntityMapper } from "@playatlas/common/application";
import { PlatformIdParser, PlaynitePlatformIdParser } from "@playatlas/common/domain";
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
		const playniteSnapshot = entity.getPlayniteSnapshot();

		const dto: PlatformResponseDto = {
			Id: entity.getId(),
			PlayniteId: playniteSnapshot?.id ?? null,
			Name: entity.getName(),
			PlayniteSpecificationId: playniteSnapshot?.specificationId ?? null,
			Sync: {
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				DeletedAt: entity.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: entity.getDeleteAfter()?.toISOString() ?? null,
			},
		};
		return dto;
	};

	return {
		toPersistence: (entity) => {
			const playniteSnapshot = entity.getPlayniteSnapshot();

			const model: PlatformModel = {
				Id: entity.getId(),
				PlayniteId: playniteSnapshot?.id ?? null,
				PlayniteSpecificationId: playniteSnapshot?.specificationId ?? null,
				Name: entity.getName(),
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
				playniteSnapshot: {
					id: model.PlayniteId ? PlaynitePlatformIdParser.fromTrusted(model.PlayniteId) : null,
					specificationId: model.PlayniteSpecificationId,
				},
				lastUpdatedAt: new Date(model.LastUpdatedAt),
				createdAt: new Date(model.CreatedAt),
				deletedAt: model.DeletedAt ? new Date(model.DeletedAt) : null,
				deleteAfter: model.DeleteAfter ? new Date(model.DeleteAfter) : null,
			});
			return entity;
		},
		toDto: _toDto,
		toDtoList: (entities) => {
			return entities.map(_toDto);
		},
	};
};
