import type { EntityMapper } from "@playatlas/common/application";
import { PlayniteTagIdParser, TagIdParser } from "@playatlas/common/domain";
import type { Tag } from "../domain";
import type { TagModel } from "../infra";
import type { ITagFactoryPort } from "./tag.factory";

export type ITagMapperPort = EntityMapper<Tag, TagModel>;

export type TagMapperDeps = {
	tagFactory: ITagFactoryPort;
};

export const makeTagMapper = ({ tagFactory }: TagMapperDeps): ITagMapperPort => {
	// const _toDto: ITagMapperPort["toDto"] = (entity) => {
	//   const dto: TagResponseDto = {
	//     Id: entity.getId(),
	//     PlayniteId: entity.getPlayniteSnapshot()?.id ?? null,
	//     Name: entity.getName(),
	//     Sync: {
	//       LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
	//       DeletedAt: entity.getDeletedAt()?.toISOString() ?? null,
	//       DeleteAfter: entity.getDeleteAfter()?.toISOString() ?? null,
	//     },
	//   };
	//   return dto;
	// };

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
	};
};
