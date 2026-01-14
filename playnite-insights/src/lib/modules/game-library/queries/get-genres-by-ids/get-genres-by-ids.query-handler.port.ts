import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type { GetGenresByIdsQuery, GetGenresByIdsQueryResult } from "./get-genres-by-ids.query";

export type IGetGenresByIdsQueryHandlerPort = IAsyncQueryHandlerPort<
	GetGenresByIdsQuery,
	GetGenresByIdsQueryResult
>;
