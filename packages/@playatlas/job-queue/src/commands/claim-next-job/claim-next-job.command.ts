import type { WorkerId } from "@playatlas/common/domain";

export type ClaimNextJobCommand = {
	workerId: WorkerId;
	now: Date;
};
