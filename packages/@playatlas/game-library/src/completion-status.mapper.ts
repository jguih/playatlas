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
		};
		return record;
	},
	toDomain: (completionStatus: CompletionStatusModel): CompletionStatus => {
		const entity: CompletionStatus = makeCompletionStatus({
			id: CompletionStatusIdParser.fromTrusted(completionStatus.Id),
			name: completionStatus.Name,
			lastUpdatedAt: new Date(completionStatus.LastUpdatedAt),
		});
		return entity;
	},
};
