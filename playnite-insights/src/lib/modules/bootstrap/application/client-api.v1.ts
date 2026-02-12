import type { IAuthFlowPort } from "$lib/modules/auth/application";
import type { IDomainEventBusPort } from "$lib/modules/common/application";
import type { IRecommendationEnginePort } from "$lib/modules/game-library/application";
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
	IGetGameClassificationByGameIdQueryHandler,
	IGetGameClassificationByIdsQueryHandler,
	IGetGameLibraryFiltersQueryHandlerPort,
	IGetGamesByIdsQueryHandlerPort,
	IGetGamesQueryHandlerPort,
	IGetGamesRankedQueryHandlerPort,
	IGetGenreByIdQueryHandlerPort,
	IGetGenresByIdsQueryHandlerPort,
	IGetPlatformsByIdsQueryHandlerPort,
} from "$lib/modules/game-library/queries";
import type { IGameSessionReadonlyStore } from "$lib/modules/game-session/infra";
import type {
	IPlayAtlasSyncManagerPort,
	ISyncProgressReporterPort,
} from "$lib/modules/synchronization/application";

export interface ClientApiV1 {
	GameLibrary: {
		ScoringEngine: {
			Query: {
				GetGameClassifications: IGetGameClassificationByIdsQueryHandler;
				GetGameClassificationsByGameId: IGetGameClassificationByGameIdQueryHandler;
			};
			Command: {
				SyncGameClassifications: ISyncGameClassificationsCommandHandlerPort;
			};
		};
		RecommendationEngine: IRecommendationEnginePort;
		Query: {
			GetGames: IGetGamesQueryHandlerPort;
			GetGamesByIds: IGetGamesByIdsQueryHandlerPort;
			GetGamesRanked: IGetGamesRankedQueryHandlerPort;
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
	};
	Synchronization: {
		SyncManager: IPlayAtlasSyncManagerPort;
		SyncProgressReporter: ISyncProgressReporterPort;
	};
	Auth: {
		Flow: IAuthFlowPort;
	};
	GameSession: {
		GameSessionReadonlyStore: IGameSessionReadonlyStore;
	};
	EventBus: IDomainEventBusPort;
}
