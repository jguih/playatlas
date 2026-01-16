import { type EntityMapper } from "@playatlas/common/application";
import { CompletionStatusIdParser } from "@playatlas/common/domain";
import { makeCompletionStatus, type CompletionStatus } from "./domain/completion-status.entity";
import type { CompletionStatusModel } from "./infra/completion-status.repository";

export const completionStatusMapper: EntityMapper<CompletionStatus, CompletionStatusModel> = {
	toPersistence: (completionStatus: CompletionStatus): CompletionStatusModel => {
		const record: CompletionStatusModel = {
			Id: completionStatus.getId(),
			Name: completionStatus.getName(),
			LastUpdatedAt: completionStatus.getLastUpdatedAt().toISOString(),
			CreatedAt: completionStatus.getCreatedAt().toISOString(),
			DeleteAfter: null,
			DeletedAt: null,
		};
		return record;
	},
	toDomain: (completionStatus: CompletionStatusModel): CompletionStatus => {
		const entity: CompletionStatus = makeCompletionStatus({
			id: CompletionStatusIdParser.fromTrusted(completionStatus.Id),
			name: completionStatus.Name,
			lastUpdatedAt: new Date(completionStatus.LastUpdatedAt),
			createdAt: new Date(completionStatus.CreatedAt),
		});
		return entity;
	},
};
