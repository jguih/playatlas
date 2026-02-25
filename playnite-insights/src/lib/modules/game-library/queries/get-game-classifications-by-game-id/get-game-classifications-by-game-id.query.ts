import type { GameId } from "$lib/modules/common/domain";
import type { ClassificationId } from "@playatlas/common/domain";
import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";

export type GetGameClassificationsByGameIdQuery = {
	gameId: GameId;
};

export type GetGameClassificationsByGameIdQueryResult = {
	gameClassifications: Map<ClassificationId, Set<GameClassification>> | null;
};
