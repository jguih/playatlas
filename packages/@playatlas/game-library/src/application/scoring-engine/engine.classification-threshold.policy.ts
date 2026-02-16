import type { CanonicalClassificationThresholdTier } from "@playatlas/common/domain";

export type ScoreEngineClassificationThresholdPolicy = Record<
	CanonicalClassificationThresholdTier,
	number
>;
