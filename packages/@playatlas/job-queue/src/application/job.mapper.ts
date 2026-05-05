import type { EntityMapper } from "@playatlas/common/application";
import { JobIdParser, WorkerIdParser } from "@playatlas/common/domain";
import type { Job } from "../domain/job.entity";
import type { JobModel } from "../infra/job.repository";
import type { IJobFactoryPort } from "./job.factory";

export type IJobMapperPort = EntityMapper<Job, JobModel>;

export type JobMapperDeps = {
	jobFactory: IJobFactoryPort;
};

export const makeJobMapper = ({ jobFactory }: JobMapperDeps): IJobMapperPort => {
	return {
		toDomain: (model) => {
			return jobFactory.rehydrate({
				id: JobIdParser.fromTrusted(model.Id),
				type: model.Type,
				payload: model.Payload,
				status: model.Status,
				attempts: model.Attempts,
				maxAttempts: model.MaxAttempts,
				priority: model.Priority,
				runAt: new Date(model.RunAt),
				lockedAt: model.LockedAt ? new Date(model.LockedAt) : null,
				workerId: model.WorkerId ? WorkerIdParser.fromTrusted(model.WorkerId) : null,
				lastError: model.LastError,
				createdAt: new Date(model.CreatedAt),
				lastUpdatedAt: new Date(model.LastUpdatedAt),
				deletedAt: model.DeletedAt ? new Date(model.DeletedAt) : null,
				deleteAfter: model.DeleteAfter ? new Date(model.DeleteAfter) : null,
			});
		},
		toPersistence: (entity) => {
			return {
				Id: entity.getId(),
				Type: entity.getType(),
				Payload: entity.getPayload(),
				Status: entity.getStatus(),
				Attempts: entity.getAttempts(),
				MaxAttempts: entity.getMaxAttempts(),
				Priority: entity.getPriority(),
				RunAt: entity.getRunAt().toISOString(),
				LockedAt: entity.getLockedAt()?.toISOString() ?? null,
				WorkerId: entity.getWorkerId(),
				LastError: entity.getLastError(),
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				CreatedAt: entity.getCreatedAt().toISOString(),
				DeletedAt: entity.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: entity.getDeleteAfter()?.toISOString() ?? null,
			};
		},
	};
};
