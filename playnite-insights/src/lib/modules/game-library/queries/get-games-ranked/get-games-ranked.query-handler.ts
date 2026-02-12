import { GAME_CLASSIFICATION_INDEX } from "$lib/modules/common/domain";
import type { IGameVectorProjectionServicePort } from "../../application/recommendation-engine/game-vector-projection.service";
import type {
	IRecommendationEnginePort,
	RankedGame,
} from "../../application/recommendation-engine/recommendation-engine";
import type { RecommendationEngineFilter } from "../../application/recommendation-engine/recommendation-engine.types";
import type { IGameRepositoryPort } from "../../infra/game.repository.port";
import type { IGetGamesRankedQueryHandlerPort } from "./get-games-ranked.query-handler.port";

export type GetGamesRankedQueryHandlerDeps = {
	recommendationEngine: IRecommendationEnginePort;
	gameRepository: IGameRepositoryPort;
	gameVectorProjectionService: IGameVectorProjectionServicePort;
};

export class GetGamesRankedQueryHandler implements IGetGamesRankedQueryHandlerPort {
	constructor(private readonly deps: GetGamesRankedQueryHandlerDeps) {}

	private paginate = (props: { items: RankedGame[]; cursor?: number | null; limit: number }) => {
		const { items, limit } = props;
		const cursor = props.cursor ?? 0;

		const slice = items.slice(cursor, cursor + limit);
		const nextKey = cursor + slice.length < items.length ? cursor + slice.length : null;

		return { slice, nextKey };
	};

	executeAsync: IGetGamesRankedQueryHandlerPort["executeAsync"] = async (query) => {
		const filter: RecommendationEngineFilter = ({ vector }): boolean =>
			vector[GAME_CLASSIFICATION_INDEX.HORROR] > 0.4;

		const ranked = await this.deps.recommendationEngine.recommendForInstanceAsync({
			filters: [filter],
		});

		const { slice, nextKey } = this.paginate({
			items: ranked,
			limit: query.limit,
			cursor: query.cursor,
		});

		const similarityMap = new Map(slice.map((r) => [r.gameId, r.similarity]));

		const games = await this.deps.gameRepository.getByIdsAsync(slice.map((s) => s.gameId));

		games.sort((a, b) => similarityMap.get(b.Id)! - similarityMap.get(a.Id)!);

		return { games, nextKey };
	};
}
