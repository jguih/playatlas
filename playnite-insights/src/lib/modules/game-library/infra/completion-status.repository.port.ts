import type { IClientEntityRepository } from "$lib/modules/common/infra";
import type { CompletionStatus, CompletionStatusId } from "../domain/completion-status.entity";

export type ICompletionStatusRepositoryPort = IClientEntityRepository<
	CompletionStatus,
	CompletionStatusId
>;
