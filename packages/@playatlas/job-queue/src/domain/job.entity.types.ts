import type {
	BaseEntitySoftDeleteProps,
	BaseEntitySyncProps,
	JobId,
	JobStatus,
	JobType,
	WorkerId,
} from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";

type BaseJobProps = {
	id: JobId;
	type: JobType;
	payload: string;
	status: JobStatus;
	attempts: number;
	maxAttempts: number;
	priority: number;
	runAt: Date;
	lockedAt: Date | null;
	workerId: WorkerId | null;
	lastError: string | null;
};

export type MakeJobProps = BaseJobProps &
	Partial<BaseEntitySyncProps> &
	Partial<BaseEntitySoftDeleteProps>;

export type RehydrateJobProps = BaseJobProps & BaseEntitySyncProps & BaseEntitySoftDeleteProps;

export type BuildJobDeps = {
	clock: IClockPort;
};
