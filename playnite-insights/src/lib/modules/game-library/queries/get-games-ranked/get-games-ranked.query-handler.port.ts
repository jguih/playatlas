import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type { GetGamesRankedQuery } from "./get-games-ranked.query";
import type { GetGamesRankedQueryResult } from "./get-games-ranked.query.types";

export type IGetGamesRankedQueryHandlerPort = IAsyncQueryHandlerPort<
	GetGamesRankedQuery,
	GetGamesRankedQueryResult
>;
