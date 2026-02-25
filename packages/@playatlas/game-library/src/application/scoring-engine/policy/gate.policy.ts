import type { EngineScoreMode } from "@playatlas/common/domain";
import type { ScoreEnginePolicy } from "./policy.types";

export type ScoreEngineGatePolicy<TGroup> = ScoreEnginePolicy<
	TGroup,
	{ mode: EngineScoreMode; confidenceMultiplier: number }
>;
