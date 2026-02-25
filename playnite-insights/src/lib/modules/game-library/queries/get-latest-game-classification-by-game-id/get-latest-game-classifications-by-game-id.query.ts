import type { GameId } from "$lib/modules/common/domain";
import type { ClassificationId } from "@playatlas/common/domain";
import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";

export type GetLatestGameClassificationsByGameIdQuery = {
	gameId: GameId;
};

export type GetLatestGameClassificationsByGameIdQueryResult = {
	gameClassifications: Map<ClassificationId, GameClassification> | null;
};
