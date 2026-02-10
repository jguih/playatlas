import type { IClockPort } from "$lib/modules/common/application";
import { GameClassificationIdParser, GameIdParser } from "$lib/modules/common/domain";
import type { IGameClassificationMapperPort } from "./game-classification.mapper.port";

export type GameClassificationMapperDeps = {
	clock: IClockPort;
};

export class GameClassificationMapper implements IGameClassificationMapperPort {
	constructor(private readonly deps: GameClassificationMapperDeps) {}

	fromDto: IGameClassificationMapperPort["fromDto"] = (dto, lastSync) => {
		return {
			Id: GameClassificationIdParser.fromTrusted(dto.Id),
			SourceLastUpdatedAt: new Date(dto.Sync.LastUpdatedAt),
			DeletedAt: dto.Sync.DeletedAt ? new Date(dto.Sync.DeletedAt) : null,
			DeleteAfter: dto.Sync.DeleteAfter ? new Date(dto.Sync.DeleteAfter) : null,
			ClassificationId: dto.ClassificationId,
			GameId: GameIdParser.fromTrusted(dto.GameId),
			Score: dto.Score,
			NormalizedScore: dto.NormalizedScore,
			ScoreMode: dto.ScoreMode,
			Breakdown: dto.Breakdown,
			Sync: {
				Status: "synced",
				LastSyncedAt: lastSync ?? this.deps.clock.now(),
				ErrorMessage: null,
			},
		};
	};

	toDomain: IGameClassificationMapperPort["toDomain"] = (model) => {
		return {
			Id: model.Id,
			SourceLastUpdatedAt: model.SourceLastUpdatedAt,
			DeletedAt: model.DeletedAt ? new Date(model.DeletedAt) : null,
			DeleteAfter: model.DeleteAfter ? new Date(model.DeleteAfter) : null,
			ClassificationId: model.ClassificationId,
			GameId: model.GameId,
			Score: model.Score,
			NormalizedScore: model.NormalizedScore,
			ScoreMode: model.ScoreMode,
			Breakdown: model.Breakdown,
			Sync: {
				LastSyncedAt: model.Sync.LastSyncedAt,
				ErrorMessage: model.Sync.ErrorMessage ?? null,
				Status: model.Sync.Status,
			},
		};
	};

	toPersistence: IGameClassificationMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			SourceLastUpdatedAt: entity.SourceLastUpdatedAt,
			SourceLastUpdatedAtMs: entity.SourceLastUpdatedAt.getTime(),
			DeletedAt: entity.DeletedAt,
			DeleteAfter: entity.DeleteAfter,
			ClassificationId: entity.ClassificationId,
			GameId: entity.GameId,
			Score: entity.Score,
			NormalizedScore: entity.NormalizedScore,
			ScoreMode: entity.ScoreMode,
			Breakdown: entity.Breakdown,
			Sync: {
				LastSyncedAt: entity.Sync.LastSyncedAt,
				ErrorMessage: entity.Sync.ErrorMessage,
				Status: entity.Sync.Status,
			},
		};
	};
}
