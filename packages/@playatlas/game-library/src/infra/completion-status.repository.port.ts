import type { CompletionStatusId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { CompletionStatus } from "../domain/completion-status.entity";

export type ICompletionStatusRepositoryPort = IEntityRepositoryPort<
	CompletionStatusId,
	CompletionStatus
> & {};
