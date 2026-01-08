import type { IGetGamesQueryHandler } from '../game-library/queries/get-games/get-games.query-handler.port';

export interface ClientApi {
	get GetGamesQueryHandler(): IGetGamesQueryHandler;
}
