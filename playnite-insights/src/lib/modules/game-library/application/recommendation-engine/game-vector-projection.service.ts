import {
	GAME_CLASSIFICATION_DIMENSIONS,
	GAME_CLASSIFICATION_INDEX,
	type GameId,
} from "$lib/modules/common/domain";
import type { IGameVectorReadonlyStore } from "../../infra/recommendation-engine/game-vector.readonly-store";

export type GameVectorProjection = Map<GameId, Float32Array>;

export type IGameVectorProjectionServicePort = {
	buildAsync: () => Promise<GameVectorProjection>;
};

export type GameVectorProjectionServiceDeps = {
	gameVectorReadonlyStore: IGameVectorReadonlyStore;
};

export class GameVectorProjectionService implements IGameVectorProjectionServicePort {
	constructor(private readonly deps: GameVectorProjectionServiceDeps) {}

	buildAsync: IGameVectorProjectionServicePort["buildAsync"] = async () => {
		const rows = await this.deps.gameVectorReadonlyStore.getAllAsync();

		const map: GameVectorProjection = new Map();

		for (const row of rows) {
			let vec = map.get(row.GameId);

			if (!vec) {
				vec = new Float32Array(GAME_CLASSIFICATION_DIMENSIONS);
				map.set(row.GameId, vec);
			}

			const index = GAME_CLASSIFICATION_INDEX[row.ClassificationId];
			vec[index] = row.NormalizedScore;
		}

		return map;
	};
}
