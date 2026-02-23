import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type {
	GetLatestGameClassificationsByGameIdQuery,
	GetLatestGameClassificationsByGameIdQueryResult,
} from "./get-latest-game-classifications-by-game-id.query";

export type IGetLatestGameClassificationByGameIdQueryHandler = IAsyncQueryHandlerPort<
	GetLatestGameClassificationsByGameIdQuery,
	GetLatestGameClassificationsByGameIdQueryResult
>;
