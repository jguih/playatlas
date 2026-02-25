import type { EntityMapper } from "@playatlas/common/application";
import { GameClassificationIdParser, GameIdParser } from "@playatlas/common/domain";
import type { GameClassification } from "../../domain";
import type { GameClassificationResponseDto } from "../../dtos";
import type { GameClassificationModel } from "../../infra";
import type { IScoreEngineRegistryPort } from "./engines/engine.registry";
import type { IGameClassificationFactoryPort } from "./game-classification.factory";
import type { IScoreBreakdownNormalizerPort } from "./score-breakdown-normalizer.port";

export type IGameClassificationMapperPort = EntityMapper<
	GameClassification,
	GameClassificationModel,
	GameClassificationResponseDto
>;

export type GameClassificationMapperDeps = {
	gameClassificationFactory: IGameClassificationFactoryPort;
	scoreBreakdownNormalizer: IScoreBreakdownNormalizerPort;
	scoreEngineRegistry: IScoreEngineRegistryPort;
};

export const makeGameClassificationMapper = ({
	gameClassificationFactory,
	scoreBreakdownNormalizer,
	scoreEngineRegistry,
}: GameClassificationMapperDeps): IGameClassificationMapperPort => {
	const _toDto: IGameClassificationMapperPort["toDto"] = (entity) => {
		const Breakdown = scoreBreakdownNormalizer.normalize(entity.getBreakdownJson());
		const engine = scoreEngineRegistry.get(entity.getClassificationId());

		return {
			Id: entity.getId(),
			GameId: entity.getGameId(),
			ClassificationId: entity.getClassificationId(),
			Score: entity.getScore(),
			NormalizedScore: entity.getNormalizedScore(),
			ScoreMode: entity.getMode(),
			Breakdown,
			EvidenceGroupMeta: engine.evidenceGroupMeta,
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
				classificationId: model.ClassificationId,
				score: model.Score,
				normalizedScore: model.NormalizedScore,
				mode: model.Mode,
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
				NormalizedScore: entity.getNormalizedScore(),
				Mode: entity.getMode(),
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
