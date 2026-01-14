import type { EntityRepository } from "@playatlas/common/infra";
import type { CompletionStatus, CompletionStatusId } from "../domain/completion-status.entity";

export type ICompletionStatusRepositoryPort = EntityRepository<
	CompletionStatusId,
	CompletionStatus
> & {};
