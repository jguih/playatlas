import type { ISyncGamesCommandHandlerPort } from '$lib/modules/game-library/commands/sync-games';
import type { ISyncGenresCommandHandlerPort } from '$lib/modules/game-library/commands/sync-genres';
import type { IGetGamesQueryHandlerPort } from '$lib/modules/game-library/queries/get-games';
import type { IGetGenreByIdQueryHandlerPort } from '$lib/modules/game-library/queries/get-genre-by-id';

export interface ClientApi {
	GameLibrary: {
		Query: {
			GetGames: IGetGamesQueryHandlerPort;
			GetGenreById: IGetGenreByIdQueryHandlerPort;
		};
		Command: {
			SyncGames: ISyncGamesCommandHandlerPort;
			SyncGenres: ISyncGenresCommandHandlerPort;
		};
	};
}
