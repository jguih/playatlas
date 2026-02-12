import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type { GetGameVectorsQuery, GetGameVectorsQueryResult } from "./get-games-vectors.query";

export type IGetGameVectorsQueryHandlerPort = IAsyncQueryHandlerPort<
	GetGameVectorsQuery,
	GetGameVectorsQueryResult
>;
