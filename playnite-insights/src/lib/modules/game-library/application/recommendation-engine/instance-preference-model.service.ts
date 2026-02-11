import type { IClockPort } from "$lib/modules/common/application";
import { GAME_CLASSIFICATION_DIMENSIONS, type GameId } from "$lib/modules/common/domain";
import type { GameSessionReadModel } from "$lib/modules/game-session/application";
import type { IGameSessionReadonlyStore } from "$lib/modules/game-session/infra";

export type IInstancePreferenceModelService = {
	buildAsync: (gameVectors: Map<GameId, Float32Array>) => Promise<Float32Array>;
};

export type InstancePreferenceModelServiceDeps = {
	gameSessionReadonlyStore: IGameSessionReadonlyStore;
	clock: IClockPort;
};

export class InstancePreferenceModelService implements IInstancePreferenceModelService {
	private readonly lambda: number = 0.05;
	private readonly ONE_DAY_MS: number = 1000 * 60 * 60 * 24;

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

	buildAsync: IInstancePreferenceModelService["buildAsync"] = async (gameVectors) => {
		const instance = new Float32Array(GAME_CLASSIFICATION_DIMENSIONS);
		const now = this.deps.clock.now();
		const sessions = await this.deps.gameSessionReadonlyStore.getAllAsync();

		for (const session of sessions) {
			if (!session.EndTime) continue;

			const vec = gameVectors.get(session.GameId);
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
}
