import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type { GetGamesQuery } from "$lib/modules/common/queries";
import type { Game } from "../../domain/game.entity";

export type GetGamesQueryResult = {
	items: Game[];
	nextKey: IDBValidKey | null;
};

export type IGetGamesQueryHandlerPort = IAsyncQueryHandlerPort<GetGamesQuery, GetGamesQueryResult>;
