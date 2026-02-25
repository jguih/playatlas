import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type {
	GetGameClassificationsByGameIdQuery,
	GetGameClassificationsByGameIdQueryResult,
} from "./get-game-classifications-by-game-id.query";

export type IGetGameClassificationByGameIdQueryHandler = IAsyncQueryHandlerPort<
	GetGameClassificationsByGameIdQuery,
	GetGameClassificationsByGameIdQueryResult
>;
