import type { ISyncCompaniesCommandHandlerPort } from '$lib/modules/game-library/commands/sync-companies';
import type { ISyncGamesCommandHandlerPort } from '$lib/modules/game-library/commands/sync-games';
import type { ISyncGenresCommandHandlerPort } from '$lib/modules/game-library/commands/sync-genres';
import type { IGameRepositoryPort, IGenreRepositoryPort } from '$lib/modules/game-library/infra';
import type { IGetCompaniesByIdsQueryHandlerPort } from '$lib/modules/game-library/queries/get-companies-by-ids';
import type { IGetGamesQueryHandlerPort } from '$lib/modules/game-library/queries/get-games';
import type { IGetGamesByIdsQueryHandlerPort } from '$lib/modules/game-library/queries/get-games-by-ids';
import type { IGetGenreByIdQueryHandlerPort } from '$lib/modules/game-library/queries/get-genre-by-id';
import type { IGetGenresByIdsQueryHandlerPort } from '$lib/modules/game-library/queries/get-genres-by-ids';

export interface IClientGameLibraryModulePort {
	get gameRepository(): IGameRepositoryPort;
	get genreRepository(): IGenreRepositoryPort;
	get getGamesQueryHandler(): IGetGamesQueryHandlerPort;
	get getGamesByIdsQueryHandler(): IGetGamesByIdsQueryHandlerPort;
	get getGenreByIdQueryHandler(): IGetGenreByIdQueryHandlerPort;
	get getGenresByIdsQueryHandler(): IGetGenresByIdsQueryHandlerPort;
	get getCompaniesByIdsQueryHandler(): IGetCompaniesByIdsQueryHandlerPort;
	get syncGamesCommandHandler(): ISyncGamesCommandHandlerPort;
	get syncGenresCommandHandler(): ISyncGenresCommandHandlerPort;
	get syncCompaniesCommandHandler(): ISyncCompaniesCommandHandlerPort;
}
