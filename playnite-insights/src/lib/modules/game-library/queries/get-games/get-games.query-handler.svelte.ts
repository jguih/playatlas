import type { IGameRepositoryPort } from '../../infra/game.repository.port';
import type { IGetGamesQueryHandler } from './get-games.query-handler.port';

export type GetGamesQueryHandlerDeps = {
	gameRepository: IGameRepositoryPort;
};

export class GetGamesQueryHandler implements IGetGamesQueryHandler {
	#gameRepository: IGameRepositoryPort;

	constructor({ gameRepository }: GetGamesQueryHandlerDeps) {
		this.#gameRepository = gameRepository;
	}

	executeAsync: IGetGamesQueryHandler['executeAsync'] = async (query) => {
		if (query.sort === 'recent') {
			return this.#gameRepository.queryAsync({
				index: 'byUpdatedAt',
				direction: 'prev',
				afterKey: query.cursor,
				limit: query.limit,
			});
		}

		throw new Error('Unsupported query');
	};
}
