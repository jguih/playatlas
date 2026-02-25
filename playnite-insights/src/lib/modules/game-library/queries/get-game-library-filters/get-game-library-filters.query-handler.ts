import type { IGameLibraryFilterRepositoryPort } from "../../infra/game-library-filter.repository.port";
import type { IGetGameLibraryFiltersQueryHandlerPort } from "./get-game-library-filters.query-handler.port";

export type GetGameLibraryFiltersQueryHandlerDeps = {
	gameLibraryFilterRepository: IGameLibraryFilterRepositoryPort;
};

export class GetGameLibraryFiltersQueryHandler implements IGetGameLibraryFiltersQueryHandlerPort {
	constructor(private readonly deps: GetGameLibraryFiltersQueryHandlerDeps) {}

	executeAsync: IGetGameLibraryFiltersQueryHandlerPort["executeAsync"] = async (query) => {
		if (query.sort === "recentlyUsed") {
			if (query.sortOrder === "desc") {
				const gameLibraryFilters =
					await this.deps.gameLibraryFilterRepository.getByLastUsedAtDescAsync();
				return { gameLibraryFilters };
			}
		}

		throw Error("Query not supported");
	};
}
