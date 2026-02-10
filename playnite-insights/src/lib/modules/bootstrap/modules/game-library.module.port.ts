import type {
	ICompanyMapperPort,
	ICompletionStatusMapperPort,
	IGameClassificationMapperPort,
	IGameLibraryFilterMapperPort,
	IGameLibrarySyncManagerPort,
	IGameLibrarySyncStatePort,
	IGameMapperPort,
	IGenreMapperPort,
	IPlatformMapperPort,
	IPlayAtlasClientPort,
	ISyncCompaniesFlowPort,
	ISyncCompletionStatusesFlowPort,
	ISyncGameClassificationsFlowPort,
	ISyncGamesFlowPort,
	ISyncGenresFlowPort,
	ISyncPlatformsFlowPort,
} from "$lib/modules/game-library/application";
import type { ISyncProgressReporterPort } from "$lib/modules/game-library/application/sync-progress-reporter.svelte";
import type {
	ICreateGameLibraryCommandHandler,
	ISyncCompaniesCommandHandlerPort,
	ISyncCompletionStatusesCommandHandlerPort,
	ISyncGameClassificationsCommandHandlerPort,
	ISyncGamesCommandHandlerPort,
	ISyncGenresCommandHandlerPort,
	ISyncPlatformsCommandHandlerPort,
} from "$lib/modules/game-library/commands";
import type {
	ICompanyRepositoryPort,
	ICompletionStatusRepositoryPort,
	IGameClassificationRepositoryPort,
	IGameLibraryFilterHasherPort,
	IGameLibraryFilterRepositoryPort,
	IGameRepositoryPort,
	IGameVectorReadonlyStore,
	IGameVectorWriteStore,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "$lib/modules/game-library/infra";
import type {
	IGetCompaniesByIdsQueryHandlerPort,
	IGetCompletionStatusesByIdsQueryHandlerPort,
	IGetGameClassificationByGameIdQueryHandler,
	IGetGameClassificationByIdsQueryHandler,
	IGetGameLibraryFiltersQueryHandlerPort,
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

	get genreMapper(): IGenreMapperPort;
	get genreRepository(): IGenreRepositoryPort;
	get getGenreByIdQueryHandler(): IGetGenreByIdQueryHandlerPort;
	get getGenresByIdsQueryHandler(): IGetGenresByIdsQueryHandlerPort;
	get syncGenresCommandHandler(): ISyncGenresCommandHandlerPort;
	get syncGenresFlow(): ISyncGenresFlowPort;

	get companyMapper(): ICompanyMapperPort;
	get companyRepository(): ICompanyRepositoryPort;
	get getCompaniesByIdsQueryHandler(): IGetCompaniesByIdsQueryHandlerPort;
	get syncCompaniesCommandHandler(): ISyncCompaniesCommandHandlerPort;
	get syncCompaniesFlow(): ISyncCompaniesFlowPort;

	get platformMapper(): IPlatformMapperPort;
	get platformRepository(): IPlatformRepositoryPort;
	get getPlatformsByIdsQueryHandler(): IGetPlatformsByIdsQueryHandlerPort;
	get syncPlatformsCommandHandler(): ISyncPlatformsCommandHandlerPort;
	get syncPlatformsFlow(): ISyncPlatformsFlowPort;

	get completionStatusMapper(): ICompletionStatusMapperPort;
	get completionStatusRepository(): ICompletionStatusRepositoryPort;
	get getCompletionStatusesByIdsQueryHandler(): IGetCompletionStatusesByIdsQueryHandlerPort;
	get syncCompletionStatusesCommandHandler(): ISyncCompletionStatusesCommandHandlerPort;
	get syncCompletionStatusesFlow(): ISyncCompletionStatusesFlowPort;

	get playAtlasClient(): IPlayAtlasClientPort;

	get gameLibrarySyncState(): IGameLibrarySyncStatePort;

	get gameLibrarySyncManager(): IGameLibrarySyncManagerPort;

	get syncProgressReporter(): ISyncProgressReporterPort;

	get gameLibraryFilterMapper(): IGameLibraryFilterMapperPort;
	get gameLibraryFilterRepository(): IGameLibraryFilterRepositoryPort;
	get gameLibraryFilterHasher(): IGameLibraryFilterHasherPort;
	get createGameLibraryFilterCommandHandler(): ICreateGameLibraryCommandHandler;
	get getGameLibraryFiltersQueryHandler(): IGetGameLibraryFiltersQueryHandlerPort;

	get gameClassificationMapper(): IGameClassificationMapperPort;
	get gameClassificationRepository(): IGameClassificationRepositoryPort;
	get getGameClassificationsByIdsQueryHandler(): IGetGameClassificationByIdsQueryHandler;
	get getGameClassificationsByGameIdQueryHandler(): IGetGameClassificationByGameIdQueryHandler;
	get syncGameClassificationsCommandHandler(): ISyncGameClassificationsCommandHandlerPort;
	get syncGameClassificationsFlow(): ISyncGameClassificationsFlowPort;
	get gameVectorWriteStore(): IGameVectorWriteStore;
	get gameVectorReadonlyStore(): IGameVectorReadonlyStore;
}
