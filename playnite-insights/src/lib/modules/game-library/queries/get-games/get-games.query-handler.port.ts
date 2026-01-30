import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type { Game } from "../../domain/game.entity";

export type GetGamesQueryFilter = {
	installed?: boolean;
	search?: string;
};

export type GetGamesQuery = {
	sort: "recent" | "name";
	filter?: GetGamesQueryFilter;
	cursor?: IDBValidKey | null;
	limit: number;
};

export type GetGamesQueryResult = {
	items: Game[];
	nextKey: IDBValidKey | null;
};

export type IGetGamesQueryHandlerPort = IAsyncQueryHandlerPort<GetGamesQuery, GetGamesQueryResult>;
