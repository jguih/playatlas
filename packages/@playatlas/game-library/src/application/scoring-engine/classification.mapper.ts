import type { EntityMapper } from "@playatlas/common/application";
import { ClassificationIdParser } from "../../domain";
import type { Classification } from "../../domain/scoring-engine/classification.entity";
import type { ClassificationModel } from "../../infra/scoring-engine/classification.repository";
import type { IClassificationFactoryPort } from "./classification.factory";

export type IClassificationMapperPort = EntityMapper<Classification, ClassificationModel>;

export type ClassificationMapperDeps = {
	classificationFactory: IClassificationFactoryPort;
};

export const makeClassificationMapper = ({
	classificationFactory,
}: ClassificationMapperDeps): IClassificationMapperPort => {
	return {
		toDomain: (model) => {
			return classificationFactory.rehydrate({
				id: ClassificationIdParser.fromTrusted(model.Id),
				category: model.Category,
				description: model.Description,
				displayName: model.DisplayName,
				createdAt: new Date(model.CreatedAt),
				lastUpdatedAt: new Date(model.LastUpdatedAt),
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
			};
			return model;
		},
	};
};
