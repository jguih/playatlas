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
		if (query.sort === "recent") {
			return this.#gameRepository.queryAsync({
				index: "bySourceUpdatedAt",
				direction: "prev",
				afterKey: query.cursor,
				limit: query.limit,
			});
		}

		throw new Error("Unsupported query");
	};
}
