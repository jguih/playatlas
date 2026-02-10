import type { PenaltyType } from "@playatlas/common/domain";

export type Penalty = {
	type: PenaltyType;
	contribution: number;
	details: string;
};
