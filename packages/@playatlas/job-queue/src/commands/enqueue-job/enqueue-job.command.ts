import type { JobType } from "@playatlas/common/domain";

export type EnqueueJobCommand = {
	payload: string;
	priority: number;
	type: JobType;
	runAt?: Date;
	maxAttempts?: number;
};
