import type { IGameRepositoryPort } from '$lib/modules/game-library/infra/game.repository.port';
import type { IGetGamesQueryHandler } from '$lib/modules/game-library/queries/get-games/get-games.query-handler.port';

export interface IClientGameLibraryModulePort {
	get gameRepository(): IGameRepositoryPort;
	get getGamesQueryHandler(): IGetGamesQueryHandler;
}
