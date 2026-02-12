import type { GameVectorProjection } from "../../application/recommendation-engine/game-vector-projection.service";

export type GetGameVectorsQuery = void;

export type GetGameVectorsQueryResult = {
	gameVectors: GameVectorProjection;
};
