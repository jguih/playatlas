import type { ISyncGamesCommandHandlerPort } from '$lib/modules/game-library/commands/sync-games';
import type { ISyncGenresCommandHandlerPort } from '$lib/modules/game-library/commands/sync-genres';
import type { IGetGamesQueryHandlerPort } from '$lib/modules/game-library/queries/get-games';

export interface ClientApi {
	GameLibrary: {
		Query: {
			GetGames: IGetGamesQueryHandlerPort;
		};
		Command: {
			SyncGames: ISyncGamesCommandHandlerPort;
			SyncGenres: ISyncGenresCommandHandlerPort;
		};
	};
}
