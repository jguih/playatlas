import type { PenaltyType } from "@playatlas/common/domain";

export type ScoreEnginePenalty = {
	type: PenaltyType;
	contribution: number;
	details: string;
};
