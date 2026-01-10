import type { ISyncGamesCommandHandlerPort } from '$lib/modules/game-library/commands/sync-games';
import type { ISyncGenresCommandHandlerPort } from '$lib/modules/game-library/commands/sync-genres';
import type { IGetGamesQueryHandlerPort } from '$lib/modules/game-library/queries/get-games';
import type { IGetGamesByIdsQueryHandlerPort } from '$lib/modules/game-library/queries/get-games-by-ids';
import type { IGetGenreByIdQueryHandlerPort } from '$lib/modules/game-library/queries/get-genre-by-id';
import type { IGetGenresByIdsQueryHandlerPort } from '$lib/modules/game-library/queries/get-genres-by-ids';

export interface ClientApi {
	GameLibrary: {
		Query: {
			GetGames: IGetGamesQueryHandlerPort;
			GetGamesByIds: IGetGamesByIdsQueryHandlerPort;
			GetGenreById: IGetGenreByIdQueryHandlerPort;
			GetGenresByIds: IGetGenresByIdsQueryHandlerPort;
		};
		Command: {
			SyncGames: ISyncGamesCommandHandlerPort;
			SyncGenres: ISyncGenresCommandHandlerPort;
		};
	};
}
