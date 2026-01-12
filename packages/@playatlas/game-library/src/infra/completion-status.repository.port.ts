import { EntityRepository } from "@playatlas/common/infra";
import {
  CompletionStatus,
  CompletionStatusId,
} from "../domain/completion-status.entity";

export type ICompletionStatusRepositoryPort = EntityRepository<
  CompletionStatusId,
  CompletionStatus
> & {};
