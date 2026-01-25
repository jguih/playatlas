import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { CompletionStatus, CompletionStatusId } from "../domain/completion-status.entity";
import type { ICompletionStatusRepositoryPort } from "./completion-status.repository.port";
import { completionStatusRepositoryMeta } from "./completion-status.repository.schema";

export type CompletionStatusRepositoryDeps = ClientEntityRepositoryDeps;

export class CompletionStatusRepository
	extends ClientEntityRepository<CompletionStatus, CompletionStatusId>
	implements ICompletionStatusRepositoryPort
{
	constructor({ dbSignal }: CompletionStatusRepositoryDeps) {
		super({ dbSignal, storeName: completionStatusRepositoryMeta.storeName });
	}
}
