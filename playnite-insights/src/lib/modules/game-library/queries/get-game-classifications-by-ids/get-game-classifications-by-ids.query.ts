import type { GameClassificationId } from "$lib/modules/common/domain";
import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";

export type GetGameClassificationsByIdsQuery = {
	gameClassificationIds: GameClassificationId | GameClassificationId[];
};

export type GetGameClassificationsByIdsQueryResult = {
	gameClassifications: GameClassification[];
};
