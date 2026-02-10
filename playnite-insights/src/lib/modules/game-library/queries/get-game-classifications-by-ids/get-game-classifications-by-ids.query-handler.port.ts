import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type {
	GetGameClassificationsByIdsQuery,
	GetGameClassificationsByIdsQueryResult,
} from "./get-game-classifications-by-ids.query";

export type IGetGameClassificationByIdsQueryHandler = IAsyncQueryHandlerPort<
	GetGameClassificationsByIdsQuery,
	GetGameClassificationsByIdsQueryResult
>;
