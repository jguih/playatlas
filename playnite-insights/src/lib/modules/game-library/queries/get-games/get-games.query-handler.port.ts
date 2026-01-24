import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type { Game } from "../../domain/game.entity";

export type GetGamesQuery = {
	sort: "recent" | "name";
	filter?: {
		installed?: boolean;
		search?: string;
	};
	cursor?: IDBValidKey | null;
	limit: number;
};

export type GetGamesQueryResult = {
	items: Game[];
	nextKey: IDBValidKey | null;
};

export type IGetGamesQueryHandlerPort = IAsyncQueryHandlerPort<GetGamesQuery, GetGamesQueryResult>;
