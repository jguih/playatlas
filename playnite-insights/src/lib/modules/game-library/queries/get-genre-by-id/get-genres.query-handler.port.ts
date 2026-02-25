import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type { GetGenreByIdQuery, GetGenreByIdQueryResult } from "./get-genres.query";

export type IGetGenreByIdQueryHandlerPort = IAsyncQueryHandlerPort<
	GetGenreByIdQuery,
	GetGenreByIdQueryResult
>;
