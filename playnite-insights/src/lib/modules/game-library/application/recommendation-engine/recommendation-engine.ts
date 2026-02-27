import type { GameId } from "$lib/modules/common/domain";
import type { IGameRecommendationRecordProjectionServicePort } from "./game-recommendation-record-projection.service";
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
	instancePreferenceModelService: IInstancePreferenceModelServicePort;
	gameRecommendationRecordProjectionService: IGameRecommendationRecordProjectionServicePort;
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

		this.deps.gameRecommendationRecordProjectionService.forEach((record) => {
			if (!applyFilters({ record })) return;

			const sim = this.cosine(instanceVector, record.Vector);

			results.push({
				gameId: record.GameId,
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
