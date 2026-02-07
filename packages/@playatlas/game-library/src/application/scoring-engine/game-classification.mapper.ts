import type { EntityMapper } from "@playatlas/common/application";
import {
	ClassificationIdParser,
	DomainError,
	GameClassificationIdParser,
	GameIdParser,
} from "@playatlas/common/domain";
import type { GameClassification } from "../../domain";
import type { GameClassificationResponseDto } from "../../dtos";
import type { GameClassificationModel } from "../../infra";
import type { IScoreEngineRegistryPort } from "./engine.registry";
import type { IGameClassificationFactoryPort } from "./game-classification.factory";
import { scoreBreakdownSchema } from "./score-breakdown";

export type IGameClassificationMapperPort = EntityMapper<
	GameClassification,
	GameClassificationModel,
	GameClassificationResponseDto
>;

export type GameClassificationMapperDeps = {
	gameClassificationFactory: IGameClassificationFactoryPort;
	scoreEngineRegistry: IScoreEngineRegistryPort;
};

export const makeGameClassificationMapper = ({
	gameClassificationFactory,
	scoreEngineRegistry,
}: GameClassificationMapperDeps): IGameClassificationMapperPort => {
	const _toDto: IGameClassificationMapperPort["toDto"] = (entity) => {
		const engine = scoreEngineRegistry.get(entity.getClassificationId());
		const breakdown = engine.deserializeBreakdown(entity.getBreakdownJson());
		const { success, data: publicBreakdown } = scoreBreakdownSchema.safeParse(breakdown);

		if (!success)
			throw new DomainError(
				`Failed to parse score breakdown for ClassificationId ${entity.getClassificationId()}`,
			);

		return {
			Id: entity.getId(),
			GameId: entity.getGameId(),
			ClassificationId: entity.getClassificationId(),
			Score: entity.getScore(),
			Breakdown: publicBreakdown,
			Sync: {
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				DeleteAfter: entity.getDeleteAfter()?.toISOString() ?? null,
				DeletedAt: entity.getDeletedAt()?.toISOString() ?? null,
			},
		};
	};

	return {
		toDomain: (model) => {
			return gameClassificationFactory.rehydrate({
				id: GameClassificationIdParser.fromTrusted(model.Id),
				gameId: GameIdParser.fromTrusted(model.GameId),
				classificationId: ClassificationIdParser.fromTrusted(model.ClassificationId),
				score: model.Score,
				breakdownJson: model.BreakdownJson,
				engineVersion: model.EngineVersion,
				createdAt: new Date(model.CreatedAt),
				deletedAt: model.DeletedAt ? new Date(model.DeletedAt) : null,
				deleteAfter: model.DeleteAfter ? new Date(model.DeleteAfter) : null,
				lastUpdatedAt: new Date(model.LastUpdatedAt),
			});
		},
		toPersistence: (entity) => {
			const model: GameClassificationModel = {
				Id: entity.getId(),
				GameId: entity.getGameId(),
				ClassificationId: entity.getClassificationId(),
				Score: entity.getScore(),
				BreakdownJson: entity.getBreakdownJson(),
				EngineVersion: entity.getEngineVersion(),
				CreatedAt: entity.getCreatedAt().toISOString(),
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
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
