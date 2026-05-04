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
		tryClaim: (workerId: WorkerId) => boolean;
		complete: () => void;
		fail: (error: string) => void;
	}>;

export const makeJob = (props: MakeJobProps, { clock }: BuildJobDeps) => {
	const now = clock.now();

	const _id = props.id;
	const _type = props.type;
	const _payload = props.payload;
	let _status = props.status;
	let _attempts = props.attempts;
	const _max_attempts = props.maxAttempts;
	const _priority = props.priority;
	let _run_at = props.runAt;
	let _locked_at = props.lockedAt;
	let _worker_id = props.workerId;
	let _last_error = props.lastError;
	const _created_at = props.createdAt ?? now;
	let _last_updated_at = props.lastUpdatedAt ?? now;

	const _validate = () => {
		if (_attempts > _max_attempts) {
			throw new Error("Attempts exceeded maxAttempts");
		}

		if (_locked_at && !_worker_id) {
			throw new Error("Locked job must have a workerId");
		}

		if (_worker_id && !_locked_at) {
			throw new Error("WorkerId without lock");
		}
	};

	const _touch = () => {
		_last_updated_at = clock.now();
	};

	_validate();

	const _soft_delete = makeSoftDeletable(
		{
			deletedAt: props.deletedAt,
			deleteAfter: props.deleteAfter,
		},
		{ clock, touch: _touch, validate: _validate },
	);

	const _release_lock = () => {
		_locked_at = null;
		_worker_id = null;
	};

	const tryClaim = (workerId: WorkerId): boolean => {
		if (_status !== "queued") return false;
		if (_locked_at) return false;
		if (_run_at > clock.now()) return false;

		_status = "processing";
		_locked_at = clock.now();
		_worker_id = workerId;
		_last_error = null;
		_attempts++;

		_touch();
		_validate();
		return true;
	};

	const complete = () => {
		if (_status !== "processing") {
			throw new Error("Cannot complete job not in processing state");
		}

		_status = "done";
		_last_error = null;
		_release_lock();

		_touch();
		_validate();
	};

	const fail = (error: string) => {
		if (_status !== "processing") {
			throw new Error("Cannot fail job not in processing state");
		}

		_last_error = error;

		if (_attempts >= _max_attempts) {
			_status = "failed";
		} else {
			_status = "queued";
			_run_at = clock.now(); // TODO: add backoff
		}

		_release_lock();

		_touch();
		_validate();
	};

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
		tryClaim,
		complete,
		fail,
		..._soft_delete,
	};

	return Object.freeze(job);
};

export const rehydrateJob = (props: RehydrateJobProps, deps: BuildJobDeps) => makeJob(props, deps);
