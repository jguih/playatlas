import type { IGameRepositoryPort } from "../../infra/game.repository.port";
import type { GetGamesByIdsQuery, GetGamesByIdsQueryResult } from "./get-games-by-ids.query";
import type { IGetGamesByIdsQueryHandlerPort } from "./get-games-by-ids.query-handler.port";

export type GetGamesByIdsQueryHandlerDeps = {
	gameRepository: IGameRepositoryPort;
};

export class GetGamesByIdsQueryHandler implements IGetGamesByIdsQueryHandlerPort {
	private readonly gameRepository: IGameRepositoryPort;

	constructor({ gameRepository }: GetGamesByIdsQueryHandlerDeps) {
		this.gameRepository = gameRepository;
	}

	async executeAsync({ gameIds }: GetGamesByIdsQuery): Promise<GetGamesByIdsQueryResult> {
		const games = await this.gameRepository.getByIdsAsync(gameIds);
		return { games };
	}
}
