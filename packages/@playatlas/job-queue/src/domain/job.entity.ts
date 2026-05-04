import {
	makeSoftDeletable,
	type BaseEntity,
	type EntitySoftDeleteProps,
	type JobId,
	type JobStatus,
	type JobType,
	type WorkerId,
} from "@playatlas/common/domain";
import type { BuildJobDeps, MakeJobProps, RehydrateJobProps } from "./job.entity.types";

export type Job = BaseEntity<JobId> &
	EntitySoftDeleteProps &
	Readonly<{
		getType: () => JobType;
		getPayload: () => string;
		getStatus: () => JobStatus;
		getAttempts: () => number;
		getMaxAttempts: () => number;
		getPriority: () => number;
		getRunAt: () => Date;
		getLockedAt: () => Date | null;
		getWorkerId: () => WorkerId | null;
		getLastError: () => string | null;
	}>;

export const makeJob = (props: MakeJobProps, { clock }: BuildJobDeps) => {
	const now = clock.now();

	const _id = props.id;
	const _type = props.type;
	const _payload = props.payload;
	const _status = props.status;
	const _attempts = props.attempts;
	const _max_attempts = props.maxAttempts;
	const _priority = props.priority;
	const _run_at = props.runAt;
	const _locked_at = props.lockedAt;
	const _worker_id = props.workerId;
	const _last_error = props.lastError;
	const _created_at = props.createdAt ?? now;
	let _last_updated_at = props.lastUpdatedAt ?? now;

	const _validate = () => {};

	const _touch = () => {
		_last_updated_at = clock.now();
	};

	_validate();

	const softDelete = makeSoftDeletable(
		{
			deletedAt: props.deletedAt,
			deleteAfter: props.deleteAfter,
		},
		{ clock, touch: _touch, validate: _validate },
	);

	const job: Job = {
		getId: () => _id,
		getSafeId: () => _id,
		getType: () => _type,
		getPayload: () => _payload,
		getStatus: () => _status,
		getAttempts: () => _attempts,
		getMaxAttempts: () => _max_attempts,
		getPriority: () => _priority,
		getRunAt: () => _run_at,
		getLockedAt: () => _locked_at,
		getWorkerId: () => _worker_id,
		getLastError: () => _last_error,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		validate: _validate,
		...softDelete,
	};

	return Object.freeze(job);
};

export const rehydrateJob = (props: RehydrateJobProps, deps: BuildJobDeps) => makeJob(props, deps);
