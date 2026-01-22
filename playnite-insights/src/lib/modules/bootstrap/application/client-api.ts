import type { IAuthServicePort, ISessionIdProvider } from "$lib/modules/auth/application";
import type { IPlayAtlasClientPort } from "$lib/modules/game-library/application";
import type { ISyncCompaniesCommandHandlerPort } from "$lib/modules/game-library/commands/sync-companies";
import type { ISyncGamesCommandHandlerPort } from "$lib/modules/game-library/commands/sync-games";
import type { ISyncGenresCommandHandlerPort } from "$lib/modules/game-library/commands/sync-genres";
import type { ISyncPlatformsCommandHandlerPort } from "$lib/modules/game-library/commands/sync-platforms";
import type { IGetCompaniesByIdsQueryHandlerPort } from "$lib/modules/game-library/queries/get-companies-by-ids";
import type { IGetGamesQueryHandlerPort } from "$lib/modules/game-library/queries/get-games";
import type { IGetGamesByIdsQueryHandlerPort } from "$lib/modules/game-library/queries/get-games-by-ids";
import type { IGetGenreByIdQueryHandlerPort } from "$lib/modules/game-library/queries/get-genre-by-id";
import type { IGetGenresByIdsQueryHandlerPort } from "$lib/modules/game-library/queries/get-genres-by-ids";
import type { IGetPlatformsByIdsQueryHandlerPort } from "$lib/modules/game-library/queries/get-platforms-by-ids";

export interface ClientApi {
	GameLibrary: {
		Query: {
			GetGames: IGetGamesQueryHandlerPort;
			GetGamesByIds: IGetGamesByIdsQueryHandlerPort;
			GetGenreById: IGetGenreByIdQueryHandlerPort;
			GetGenresByIds: IGetGenresByIdsQueryHandlerPort;
			GetCompaniesByIds: IGetCompaniesByIdsQueryHandlerPort;
			GetPlatformsByIds: IGetPlatformsByIdsQueryHandlerPort;
		};
		Command: {
			SyncGames: ISyncGamesCommandHandlerPort;
			SyncGenres: ISyncGenresCommandHandlerPort;
			SyncCompanies: ISyncCompaniesCommandHandlerPort;
			SyncPlatforms: ISyncPlatformsCommandHandlerPort;
		};
		PlayAtlasClient: IPlayAtlasClientPort;
	};
	Auth: {
		AuthService: IAuthServicePort;
		SessionIdProvider: ISessionIdProvider;
	};
}
