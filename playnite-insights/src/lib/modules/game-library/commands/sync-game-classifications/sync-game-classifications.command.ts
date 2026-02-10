import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";

export type SyncGameClassificationsCommand = {
	gameClassifications: GameClassification | GameClassification[];
};
