import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { ICompletionStatusMapperPort } from "../application";
import type { CompletionStatus, CompletionStatusId } from "../domain/completion-status.entity";
import type { ICompletionStatusRepositoryPort } from "./completion-status.repository.port";
import { completionStatusRepositoryMeta } from "./completion-status.repository.schema";

export type CompletionStatusRepositoryDeps = ClientEntityRepositoryDeps & {
	completionStatusMapper: ICompletionStatusMapperPort;
};

export type CompletionStatusModel = {
	Id: CompletionStatusId;
	Name: string | null;
	SourceUpdatedAt: Date;
	SourceUpdatedAtMs: number;
	DeletedAt?: Date | null;
	DeleteAfter?: Date | null;

	Sync: {
		Status: "pending" | "synced" | "error";
		ErrorMessage: string | null;
		LastSyncedAt: Date;
	};
};

export class CompletionStatusRepository
	extends ClientEntityRepository<CompletionStatusId, CompletionStatus, CompletionStatusModel>
	implements ICompletionStatusRepositoryPort
{
	constructor({ dbSignal, completionStatusMapper }: CompletionStatusRepositoryDeps) {
		super({
			dbSignal,
			storeName: completionStatusRepositoryMeta.storeName,
			mapper: completionStatusMapper,
		});
	}
}
