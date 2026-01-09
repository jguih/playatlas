import type { IGameRepositoryPort } from '$lib/modules/game-library/infra';
import type { IGetGamesQueryHandler } from '$lib/modules/game-library/queries/get-games';

export interface IClientGameLibraryModulePort {
	get gameRepository(): IGameRepositoryPort;
	get getGamesQueryHandler(): IGetGamesQueryHandler;
}
