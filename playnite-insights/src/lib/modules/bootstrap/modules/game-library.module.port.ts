import type {
	IGameLibrarySyncStatePort,
	IGameMapperPort,
	IPlayAtlasClientPort,
	ISyncGameLibraryServicePort,
} from "$lib/modules/game-library/application";
import type {
	ISyncCompaniesCommandHandlerPort,
	ISyncGamesCommandHandlerPort,
	ISyncGenresCommandHandlerPort,
	ISyncPlatformsCommandHandlerPort,
} from "$lib/modules/game-library/commands";
import type {
	ICompanyRepositoryPort,
	IGameRepositoryPort,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "$lib/modules/game-library/infra";
import type {
	IGetCompaniesByIdsQueryHandlerPort,
	IGetGamesByIdsQueryHandlerPort,
	IGetGamesQueryHandlerPort,
	IGetGenreByIdQueryHandlerPort,
	IGetGenresByIdsQueryHandlerPort,
	IGetPlatformsByIdsQueryHandlerPort,
} from "$lib/modules/game-library/queries";

export interface IClientGameLibraryModulePort {
	get gameRepository(): IGameRepositoryPort;
	get genreRepository(): IGenreRepositoryPort;
	get companyRepository(): ICompanyRepositoryPort;
	get platformRepository(): IPlatformRepositoryPort;

	get getGamesQueryHandler(): IGetGamesQueryHandlerPort;
	get getGamesByIdsQueryHandler(): IGetGamesByIdsQueryHandlerPort;
	get getGenreByIdQueryHandler(): IGetGenreByIdQueryHandlerPort;
	get getGenresByIdsQueryHandler(): IGetGenresByIdsQueryHandlerPort;
	get getCompaniesByIdsQueryHandler(): IGetCompaniesByIdsQueryHandlerPort;
	get getPlatformsByIdsQueryHandler(): IGetPlatformsByIdsQueryHandlerPort;

	get syncGamesCommandHandler(): ISyncGamesCommandHandlerPort;
	get syncGenresCommandHandler(): ISyncGenresCommandHandlerPort;
	get syncCompaniesCommandHandler(): ISyncCompaniesCommandHandlerPort;
	get syncPlatformsCommandHandler(): ISyncPlatformsCommandHandlerPort;

	get playAtlasClient(): IPlayAtlasClientPort;

	get gameMapper(): IGameMapperPort;

	get gameLibrarySyncState(): IGameLibrarySyncStatePort;
	get syncGameLibraryService(): ISyncGameLibraryServicePort;
}
