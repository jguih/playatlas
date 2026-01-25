import type { CompletionStatusId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { CompletionStatus } from "../domain/completion-status.entity";
import type { CompletionStatusRepositoryFilters } from "./completion-status.repository.types";

export type ICompletionStatusRepositoryPort = IEntityRepositoryPort<
	CompletionStatusId,
	CompletionStatus,
	CompletionStatusRepositoryFilters
> & {};
