import type { EntityMapper } from "@playatlas/common/application";
import { ClassificationIdParser } from "../../domain";
import type { Classification } from "../../domain/scoring-engine/classification.entity";
import type { ClassificationResponseDto } from "../../dtos";
import type { ClassificationModel } from "../../infra/scoring-engine/classification.repository";
import type { IClassificationFactoryPort } from "./classification.factory";

export type IClassificationMapperPort = EntityMapper<
	Classification,
	ClassificationModel,
	ClassificationResponseDto
>;

export type ClassificationMapperDeps = {
	classificationFactory: IClassificationFactoryPort;
};

export const makeClassificationMapper = ({
	classificationFactory,
}: ClassificationMapperDeps): IClassificationMapperPort => {
	const _toDto: IClassificationMapperPort["toDto"] = (entity) => {
		return {
			Id: entity.getId(),
			DisplayName: entity.getDisplayName(),
			Description: entity.getDescription(),
			Category: entity.getCategory(),
			Version: entity.getVersion(),
			Sync: {
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				DeletedAt: entity.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: entity.getDeleteAfter()?.toISOString() ?? null,
			},
		};
	};

	return {
		toDomain: (model) => {
			return classificationFactory.rehydrate({
				id: ClassificationIdParser.fromTrusted(model.Id),
				category: model.Category,
				description: model.Description,
				displayName: model.DisplayName,
				version: model.Version,
				createdAt: new Date(model.CreatedAt),
				lastUpdatedAt: new Date(model.LastUpdatedAt),
				deletedAt: model.DeletedAt ? new Date(model.DeletedAt) : null,
				deleteAfter: model.DeleteAfter ? new Date(model.DeleteAfter) : null,
			});
		},
		toPersistence: (entity) => {
			const model: ClassificationModel = {
				Id: entity.getId(),
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				CreatedAt: entity.getCreatedAt().toISOString(),
				DisplayName: entity.getDisplayName(),
				Description: entity.getDescription(),
				Category: entity.getCategory(),
				Version: entity.getVersion(),
				DeletedAt: entity.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: entity.getDeleteAfter()?.toISOString() ?? null,
			};
			return model;
		},
		toDto: _toDto,
		toDtoList: (entities) => {
			return entities.map(_toDto);
		},
	};
};
