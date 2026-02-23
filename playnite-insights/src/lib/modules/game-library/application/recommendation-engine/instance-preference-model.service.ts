import type { IClockPort } from "$lib/modules/common/application";
import { GAME_CLASSIFICATION_DIMENSIONS } from "$lib/modules/common/domain";
import type { GameSessionReadModel } from "$lib/modules/game-session/application";
import type { IGameSessionReadonlyStore } from "$lib/modules/game-session/infra";
import type { IGameVectorProjectionServicePort } from "./game-vector-projection.service";

export type IInstancePreferenceModelService = {
	initializeAsync: () => Promise<void>;
	getVector: () => Float32Array | null;
	invalidate: () => void;
	rebuildAsync: () => Promise<void>;
};

export type InstancePreferenceModelServiceDeps = {
	gameSessionReadonlyStore: IGameSessionReadonlyStore;
	gameVectorProjectionService: IGameVectorProjectionServicePort;
	clock: IClockPort;
};

export class InstancePreferenceModelService implements IInstancePreferenceModelService {
	private readonly lambda: number = 0.05;
	private readonly ONE_DAY_MS: number = 1000 * 60 * 60 * 24;
	private cache: Float32Array | null = null;

	constructor(private readonly deps: InstancePreferenceModelServiceDeps) {}

	private sessionWeight = (session: GameSessionReadModel, now: number): number => {
		if (!session.Duration) return 0;

		const days = (now - session.EndTime!.getTime()) / this.ONE_DAY_MS;

		const decay = Math.exp(-this.lambda * days);

		return session.Duration * decay;
	};

	private normalize = (v: Float32Array) => {
		let sum = 0;

		for (let i = 0; i < v.length; i++) {
			sum += v[i] * v[i];
		}

		const mag = Math.sqrt(sum);
		if (mag === 0) return;

		for (let i = 0; i < v.length; i++) {
			v[i] /= mag;
		}
	};

	private buildAsync = async () => {
		const instance = new Float32Array(GAME_CLASSIFICATION_DIMENSIONS);
		const now = this.deps.clock.now();
		const sessions = await this.deps.gameSessionReadonlyStore.getAllAsync();

		for (const session of sessions) {
			if (!session.EndTime) continue;

			const vec = this.deps.gameVectorProjectionService.getVector(session.GameId);
			if (!vec) continue;

			const w = this.sessionWeight(session, now.getTime());
			if (w === 0) continue;

			for (let i = 0; i < GAME_CLASSIFICATION_DIMENSIONS; i++) {
				instance[i] += vec[i] * w;
			}
		}

		this.normalize(instance);

		return instance;
	};

	initializeAsync: IInstancePreferenceModelService["initializeAsync"] = async () => {
		this.cache = await this.buildAsync();
	};

	getVector: IInstancePreferenceModelService["getVector"] = () => {
		return this.cache ? Float32Array.from(this.cache) : null;
	};

	invalidate: IInstancePreferenceModelService["invalidate"] = () => (this.cache = null);

	rebuildAsync: IInstancePreferenceModelService["rebuildAsync"] = async () => {
		this.cache = await this.buildAsync();
	};
}
