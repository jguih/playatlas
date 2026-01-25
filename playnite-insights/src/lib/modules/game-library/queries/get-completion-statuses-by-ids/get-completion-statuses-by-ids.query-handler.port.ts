import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type {
	GetCompletionStatusesByIdsQuery,
	GetCompletionStatusesByIdsQueryResult,
} from "./get-completion-statuses-by-ids.query";

export type IGetCompletionStatusesByIdsQueryHandlerPort = IAsyncQueryHandlerPort<
	GetCompletionStatusesByIdsQuery,
	GetCompletionStatusesByIdsQueryResult
>;
