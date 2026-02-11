import type { GameId } from "$lib/modules/common/domain";
import type { IGameVectorProjectionServicePort } from "./game-vector-projection.service";
import type { IInstancePreferenceModelService } from "./instance-preference-model.service";

export type RankedGame = {
	gameId: GameId;
	similarity: number;
};

export type IRecommendationEnginePort = {
	recommendAsync(limit: number): Promise<RankedGame[]>;
};

export type RecommendationEngineDeps = {
	gameVectorProjectionService: IGameVectorProjectionServicePort;
	instancePreferenceModelService: IInstancePreferenceModelService;
};

export class RecommendationEngine implements IRecommendationEnginePort {
	constructor(private readonly deps: RecommendationEngineDeps) {}

	private cosine = (a: Float32Array, b: Float32Array) => {
		let dot = 0;

		for (let i = 0; i < a.length; i++) {
			dot += a[i] * b[i];
		}

		return dot;
	};

	recommendAsync: IRecommendationEnginePort["recommendAsync"] = async (limit) => {
		const gameVectors = await this.deps.gameVectorProjectionService.buildAsync();
		const instanceVector = await this.deps.instancePreferenceModelService.buildAsync(gameVectors);
		const results: RankedGame[] = [];

		for (const [gameId, gameVector] of gameVectors) {
			const sim = this.cosine(instanceVector, gameVector);

			results.push({
				gameId,
				similarity: sim,
			});
		}

		results.sort((a, b) => b.similarity - a.similarity);

		return results.slice(0, limit);
	};
}
