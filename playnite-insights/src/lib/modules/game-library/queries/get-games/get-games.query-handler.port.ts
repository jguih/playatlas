import type { IAsyncQueryHandlerPort } from '$lib/modules/common/common';
import type { GameQueryResult } from '../../infra/game.repository.types';

export type GetGamesQuery = {
	sort: 'recent' | 'name';
	filter?: {
		installed?: boolean;
		search?: string;
	};
	cursor?: IDBValidKey | null;
	limit: number;
};

export type GetGamesQueryResult = GameQueryResult;

export type IGetGamesQueryHandlerPort = IAsyncQueryHandlerPort<GetGamesQuery, GameQueryResult>;
