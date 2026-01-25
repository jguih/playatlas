import type { CompletionStatus, CompletionStatusId } from "../../domain/completion-status.entity";

export type GetCompletionStatusesByIdsQuery = {
	completionStatusesIds: CompletionStatusId[];
};

export type GetCompletionStatusesByIdsQueryResult = {
	completionStatuses: CompletionStatus[];
};
