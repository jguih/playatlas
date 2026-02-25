import type { CompletionStatus } from "../../domain/completion-status.entity";

export type SyncCompletionStatusesCommand = {
	completionStatuses: CompletionStatus[] | CompletionStatus;
};
