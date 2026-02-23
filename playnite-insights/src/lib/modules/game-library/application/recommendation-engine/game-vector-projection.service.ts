import {
	GAME_CLASSIFICATION_DIMENSIONS,
	GAME_CLASSIFICATION_INDEX,
	type GameId,
} from "$lib/modules/common/domain";
import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";
import type {
	GameVectorReadModel,
	IGameVectorReadonlyStore,
} from "../../infra/recommendation-engine/game-vector.readonly-store";

export type GameVectorProjection = Map<GameId, Float32Array>;

export type IGameVectorProjectionServicePort = {
	initializeAsync: () => Promise<void>;
	getVector: (gameId: GameId) => Float32Array | null;
	forEach: (callback: (gameId: GameId, vector: Float32Array) => void) => void;
	invalidate: () => void;
	rebuildAsync: () => Promise<void>;
	rebuildFromClassifications: (gameClassifications: GameClassification[]) => Promise<void>;
};

export type GameVectorProjectionServiceDeps = {
	gameVectorReadonlyStore: IGameVectorReadonlyStore;
};

export class GameVectorProjectionService implements IGameVectorProjectionServicePort {
	private cache: GameVectorProjection | null = null;

	constructor(private readonly deps: GameVectorProjectionServiceDeps) {}

	private buildAsync = async (gameId?: GameId | GameId[]) => {
		let rows: GameVectorReadModel[];

		if (gameId) {
			rows = (await this.deps.gameVectorReadonlyStore.getByGameIdAsync(gameId))
				.values()
				.toArray()
				.flat();
		} else {
			rows = await this.deps.gameVectorReadonlyStore.getAllAsync();
		}

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

	initializeAsync: IGameVectorProjectionServicePort["initializeAsync"] = async () => {
		this.cache = await this.buildAsync();
	};

	getVector: IGameVectorProjectionServicePort["getVector"] = (gameId) => {
		return this.cache?.get(gameId) ?? null;
	};

	forEach: IGameVectorProjectionServicePort["forEach"] = (callback) => {
		if (!this.cache) return;

		for (const [gameId, vector] of this.cache) {
			callback(gameId, vector);
		}
	};

	invalidate: IGameVectorProjectionServicePort["invalidate"] = () => (this.cache = null);

	rebuildAsync: IGameVectorProjectionServicePort["rebuildAsync"] = async () => {
		this.cache = await this.buildAsync();
	};

	rebuildFromClassifications: IGameVectorProjectionServicePort["rebuildFromClassifications"] =
		async (gameClassifications) => {
			if (gameClassifications.length === 0) return;

			const gameIds: GameId[] = gameClassifications.map((gc) => gc.GameId);
			const newVectors = await this.buildAsync(gameIds);

			for (const gameId of gameIds) {
				const newVector = newVectors.get(gameId);
				if (newVector) this.cache?.set(gameId, newVector);
			}
		};
}
