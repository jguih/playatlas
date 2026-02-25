import type { EntityMapper } from "@playatlas/common/application";
import { PlayniteTagIdParser, TagIdParser } from "@playatlas/common/domain";
import type { Tag } from "../domain/tag.entity";
import type { TagResponseDto } from "../dtos/tag.response.dto";
import type { TagModel } from "../infra/tag.repository";
import type { ITagFactoryPort } from "./tag.factory";

export type ITagMapperPort = EntityMapper<Tag, TagModel, TagResponseDto>;

export type TagMapperDeps = {
	tagFactory: ITagFactoryPort;
};

export const makeTagMapper = ({ tagFactory }: TagMapperDeps): ITagMapperPort => {
	const _toDto: ITagMapperPort["toDto"] = (entity) => {
		const dto: TagResponseDto = {
			Id: entity.getId(),
			PlayniteId: entity.getPlayniteSnapshot()?.id ?? null,
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
		toPersistence: (entity) => {
			const model: TagModel = {
				Id: entity.getId(),
				PlayniteId: entity.getPlayniteSnapshot()?.id ?? null,
				Name: entity.getName(),
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				CreatedAt: entity.getCreatedAt().toISOString(),
				DeleteAfter: null,
				DeletedAt: null,
			};
			return model;
		},
		toDomain: (model) => {
			const entity: Tag = tagFactory.rehydrate({
				id: TagIdParser.fromTrusted(model.Id),
				playniteSnapshot: {
					id: model.PlayniteId ? PlayniteTagIdParser.fromTrusted(model.PlayniteId) : null,
				},
				name: model.Name,
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
