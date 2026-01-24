import type { GameQueryResult } from "../../infra";
import type { IGameRepositoryPort } from "../../infra/game.repository.port";
import type { IGetGamesQueryHandlerPort } from "./get-games.query-handler.port";

export type GetGamesQueryHandlerDeps = {
	gameRepository: IGameRepositoryPort;
};

export class GetGamesQueryHandler implements IGetGamesQueryHandlerPort {
	#gameRepository: IGameRepositoryPort;

	constructor({ gameRepository }: GetGamesQueryHandlerDeps) {
		this.#gameRepository = gameRepository;
	}

	executeAsync: IGetGamesQueryHandlerPort["executeAsync"] = async (query) => {
		let result: GameQueryResult | null = null;

		if (query.sort === "recent") {
			result = await this.#gameRepository.queryAsync({
				index: "bySourceUpdatedAt",
				direction: "prev",
				afterKey: query.cursor,
				limit: query.limit,
			});
		}

		if (!result) throw new Error("Unsupported query");

		const filtered = result.items.filter((g) => !g.DeletedAt);
		const lastReturnedGame = filtered[filtered.length - 1];
		const adjustedNextKey = lastReturnedGame
			? (result.keys.get(lastReturnedGame.Id) ?? null)
			: null;

		return { items: filtered, nextKey: adjustedNextKey };
	};
}
