import type { IAuthFlowPort } from "$lib/modules/auth/application";
import type { IGameLibrarySyncManagerPort } from "$lib/modules/game-library/application";
import type {
	ISyncCompaniesCommandHandlerPort,
	ISyncCompletionStatusesCommandHandlerPort,
	ISyncGamesCommandHandlerPort,
	ISyncGenresCommandHandlerPort,
	ISyncPlatformsCommandHandlerPort,
} from "$lib/modules/game-library/commands";
import type {
	IGetCompaniesByIdsQueryHandlerPort,
	IGetCompletionStatusesByIdsQueryHandlerPort,
	IGetGamesByIdsQueryHandlerPort,
	IGetGamesQueryHandlerPort,
	IGetGenreByIdQueryHandlerPort,
	IGetGenresByIdsQueryHandlerPort,
	IGetPlatformsByIdsQueryHandlerPort,
} from "$lib/modules/game-library/queries";

export interface ClientApiV1 {
	GameLibrary: {
		Query: {
			GetGames: IGetGamesQueryHandlerPort;
			GetGamesByIds: IGetGamesByIdsQueryHandlerPort;
			GetGenreById: IGetGenreByIdQueryHandlerPort;
			GetGenresByIds: IGetGenresByIdsQueryHandlerPort;
			GetCompaniesByIds: IGetCompaniesByIdsQueryHandlerPort;
			GetPlatformsByIds: IGetPlatformsByIdsQueryHandlerPort;
			GetCompletionStatusesByIds: IGetCompletionStatusesByIdsQueryHandlerPort;
		};
		Command: {
			SyncGames: ISyncGamesCommandHandlerPort;
			SyncGenres: ISyncGenresCommandHandlerPort;
			SyncCompanies: ISyncCompaniesCommandHandlerPort;
			SyncPlatforms: ISyncPlatformsCommandHandlerPort;
			SyncCompletionStatuses: ISyncCompletionStatusesCommandHandlerPort;
		};
		SyncManager: IGameLibrarySyncManagerPort;
	};
	Auth: {
		Flow: IAuthFlowPort;
	};
}
