import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type {
	GetPlatformsByIdsQuery,
	GetPlatformsByIdsQueryResult,
} from "./get-platforms-by-ids.query";

export type IGetPlatformsByIdsQueryHandlerPort = IAsyncQueryHandlerPort<
	GetPlatformsByIdsQuery,
	GetPlatformsByIdsQueryResult
>;
