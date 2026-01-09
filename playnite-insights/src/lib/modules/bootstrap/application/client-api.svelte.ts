import type { IGetGamesQueryHandler } from '$lib/modules/game-library/queries/get-games';

export interface ClientApi {
	get GetGamesQueryHandler(): IGetGamesQueryHandler;
}
