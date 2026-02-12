import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";

export type ProjectGameVectorsCommand = {
	gameClassifications: GameClassification | GameClassification[];
};

export type ProjectGameVectorsCommandResult = void;
