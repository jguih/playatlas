import type { GameId } from "$lib/modules/common/domain";
import type { IGameVectorProjectionServicePort } from "./game-vector-projection.service";
import type { IInstancePreferenceModelServicePort } from "./instance-preference-model.service";
import type {
	RecommendationEngineFilter,
	RecommendationEngineFilterProps,
} from "./recommendation-engine.types";

export type RankedGame = {
	gameId: GameId;
	similarity: number;
};

export type IRecommendationEnginePort = {
	recommendForInstanceAsync(props?: {
		filters?: RecommendationEngineFilter[];
	}): Promise<RankedGame[]>;
};

export type RecommendationEngineDeps = {
	gameVectorProjectionService: IGameVectorProjectionServicePort;
	instancePreferenceModelService: IInstancePreferenceModelServicePort;
};

export class RecommendationEngine implements IRecommendationEnginePort {
	constructor(private readonly deps: RecommendationEngineDeps) {}

	private combineFilters = (...filters: Array<RecommendationEngineFilter>) => {
		return (props: RecommendationEngineFilterProps) => filters.every((f) => f(props));
	};

	private cosine = (a: Float32Array, b: Float32Array) => {
		let dot = 0;

		for (let i = 0; i < a.length; i++) {
			dot += a[i] * b[i];
		}

		return dot;
	};

	recommendForInstanceAsync: IRecommendationEnginePort["recommendForInstanceAsync"] = async (
		props = {},
	) => {
		const { filters } = props;
		const applyFilters = this.combineFilters(...(filters ?? []));
		const instanceVector = this.deps.instancePreferenceModelService.getVector();
		const results: RankedGame[] = [];

		if (!instanceVector) {
			throw new Error(
				"InstancePreferenceModelService not initialized. Call initializeAsync() before requesting recommendations.",
			);
		}

		this.deps.gameVectorProjectionService.forEach((gameId, vector) => {
			if (!applyFilters({ gameId, vector })) return;

			const sim = this.cosine(instanceVector, vector);

			results.push({
				gameId,
				similarity: sim,
			});
		});

		results.sort((a, b) => {
			const diff = b.similarity - a.similarity;
			if (diff !== 0) return diff;
			return a.gameId.localeCompare(b.gameId);
		});

		return results;
	};
}
