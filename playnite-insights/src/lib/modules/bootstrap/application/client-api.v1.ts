import type { IAuthFlowPort } from "$lib/modules/auth/application";
import type { IDomainEventBusPort } from "$lib/modules/common/application";
import type {
	IGameLibrarySyncManagerPort,
	ISyncProgressReporterPort,
} from "$lib/modules/game-library/application";
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
	IGetCompaniesByIdsQueryHandlerPort,
	IGetCompletionStatusesByIdsQueryHandlerPort,
	IGetGameClassificationByIdsQueryHandler,
	IGetGameLibraryFiltersQueryHandlerPort,
	IGetGamesByIdsQueryHandlerPort,
	IGetGamesQueryHandlerPort,
	IGetGenreByIdQueryHandlerPort,
	IGetGenresByIdsQueryHandlerPort,
	IGetPlatformsByIdsQueryHandlerPort,
} from "$lib/modules/game-library/queries";

export interface ClientApiV1 {
	GameLibrary: {
		ScoringEngine: {
			Query: {
				GetGameClassifications: IGetGameClassificationByIdsQueryHandler;
			};
			Command: {
				SyncGameClassifications: ISyncGameClassificationsCommandHandlerPort;
			};
		};
		Query: {
			GetGames: IGetGamesQueryHandlerPort;
			GetGamesByIds: IGetGamesByIdsQueryHandlerPort;
			GetGenreById: IGetGenreByIdQueryHandlerPort;
			GetGenresByIds: IGetGenresByIdsQueryHandlerPort;
			GetCompaniesByIds: IGetCompaniesByIdsQueryHandlerPort;
			GetPlatformsByIds: IGetPlatformsByIdsQueryHandlerPort;
			GetCompletionStatusesByIds: IGetCompletionStatusesByIdsQueryHandlerPort;
			GetGameLibraryFilters: IGetGameLibraryFiltersQueryHandlerPort;
		};
		Command: {
			SyncGames: ISyncGamesCommandHandlerPort;
			SyncGenres: ISyncGenresCommandHandlerPort;
			SyncCompanies: ISyncCompaniesCommandHandlerPort;
			SyncPlatforms: ISyncPlatformsCommandHandlerPort;
			SyncCompletionStatuses: ISyncCompletionStatusesCommandHandlerPort;
			CreateGameLibraryFilter: ICreateGameLibraryCommandHandler;
		};
		SyncManager: IGameLibrarySyncManagerPort;
		SyncProgressReporter: ISyncProgressReporterPort;
	};
	Auth: {
		Flow: IAuthFlowPort;
	};
	EventBus: IDomainEventBusPort;
}
