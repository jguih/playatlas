import { type EntityMapper } from "@playatlas/common/application";
import { CompletionStatusIdParser } from "@playatlas/common/domain";
import type { ICompletionStatusFactoryPort } from ".";
import { type CompletionStatus } from "../domain/completion-status.entity";
import type { CompletionStatusModel } from "../infra/completion-status.repository";

export type ICompletionStatusMapperPort = EntityMapper<CompletionStatus, CompletionStatusModel>;

export type CompletionStatusMapperDeps = {
	completionStatusFactory: ICompletionStatusFactoryPort;
};

export const makeCompletionStatusMapper = ({
	completionStatusFactory,
}: CompletionStatusMapperDeps): ICompletionStatusMapperPort => {
	return {
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
			const entity: CompletionStatus = completionStatusFactory.rehydrate({
				id: CompletionStatusIdParser.fromTrusted(completionStatus.Id),
				name: completionStatus.Name,
				lastUpdatedAt: new Date(completionStatus.LastUpdatedAt),
				createdAt: new Date(completionStatus.CreatedAt),
				deletedAt: completionStatus.DeletedAt ? new Date(completionStatus.DeletedAt) : undefined,
				deleteAfter: completionStatus.DeleteAfter
					? new Date(completionStatus.DeleteAfter)
					: undefined,
			});
			return entity;
		},
	};
};
