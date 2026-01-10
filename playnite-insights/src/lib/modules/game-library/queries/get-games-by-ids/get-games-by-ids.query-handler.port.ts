import type { IAsyncQueryHandlerPort } from '$lib/modules/common/common';
import type { GetGamesByIdsQuery, GetGamesByIdsQueryResult } from './get-games-by-ids.query';

export type IGetGamesByIdsQueryHandlerPort = IAsyncQueryHandlerPort<
	GetGamesByIdsQuery,
	GetGamesByIdsQueryResult
>;
