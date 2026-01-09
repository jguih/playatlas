import type { ISyncGamesCommandHandlerPort } from '$lib/modules/game-library/commands/sync-games';
import type { IGameRepositoryPort, IGenreRepositoryPort } from '$lib/modules/game-library/infra';
import type { IGetGamesQueryHandlerPort } from '$lib/modules/game-library/queries/get-games';

export interface IClientGameLibraryModulePort {
	get gameRepository(): IGameRepositoryPort;
	get genreRepository(): IGenreRepositoryPort;
	get getGamesQueryHandler(): IGetGamesQueryHandlerPort;
	get syncGamesCommandHandler(): ISyncGamesCommandHandlerPort;
}
