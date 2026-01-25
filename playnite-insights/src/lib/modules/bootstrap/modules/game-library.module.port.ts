import type {
	IGameLibrarySyncManagerPort,
	IGameLibrarySyncStatePort,
	IGameMapperPort,
	IPlayAtlasClientPort,
	ISyncGamesFlowPort,
} from "$lib/modules/game-library/application";
import type {
	ISyncCompaniesCommandHandlerPort,
	ISyncCompletionStatusesCommandHandlerPort,
	ISyncGamesCommandHandlerPort,
	ISyncGenresCommandHandlerPort,
	ISyncPlatformsCommandHandlerPort,
} from "$lib/modules/game-library/commands";
import type {
	ICompanyRepositoryPort,
	ICompletionStatusRepositoryPort,
	IGameRepositoryPort,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "$lib/modules/game-library/infra";
import type {
	IGetCompaniesByIdsQueryHandlerPort,
	IGetCompletionStatusesByIdsQueryHandlerPort,
	IGetGamesByIdsQueryHandlerPort,
	IGetGamesQueryHandlerPort,
	IGetGenreByIdQueryHandlerPort,
	IGetGenresByIdsQueryHandlerPort,
	IGetPlatformsByIdsQueryHandlerPort,
} from "$lib/modules/game-library/queries";

export interface IClientGameLibraryModulePort {
	get gameMapper(): IGameMapperPort;
	get gameRepository(): IGameRepositoryPort;
	get getGamesQueryHandler(): IGetGamesQueryHandlerPort;
	get getGamesByIdsQueryHandler(): IGetGamesByIdsQueryHandlerPort;
	get syncGamesCommandHandler(): ISyncGamesCommandHandlerPort;
	get syncGamesFlow(): ISyncGamesFlowPort;

	get genreRepository(): IGenreRepositoryPort;
	get getGenreByIdQueryHandler(): IGetGenreByIdQueryHandlerPort;
	get getGenresByIdsQueryHandler(): IGetGenresByIdsQueryHandlerPort;
	get syncGenresCommandHandler(): ISyncGenresCommandHandlerPort;

	get companyRepository(): ICompanyRepositoryPort;
	get getCompaniesByIdsQueryHandler(): IGetCompaniesByIdsQueryHandlerPort;
	get syncCompaniesCommandHandler(): ISyncCompaniesCommandHandlerPort;

	get platformRepository(): IPlatformRepositoryPort;
	get getPlatformsByIdsQueryHandler(): IGetPlatformsByIdsQueryHandlerPort;
	get syncPlatformsCommandHandler(): ISyncPlatformsCommandHandlerPort;

	get completionStatusRepository(): ICompletionStatusRepositoryPort;
	get getCompletionStatusesByIdsQueryHandler(): IGetCompletionStatusesByIdsQueryHandlerPort;
	get syncCompletionStatusesCommandHandler(): ISyncCompletionStatusesCommandHandlerPort;

	get playAtlasClient(): IPlayAtlasClientPort;

	get gameLibrarySyncState(): IGameLibrarySyncStatePort;

	get gameLibrarySyncManager(): IGameLibrarySyncManagerPort;
}
