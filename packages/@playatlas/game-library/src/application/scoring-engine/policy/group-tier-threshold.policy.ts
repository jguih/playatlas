import type { EvidenceGroupThresholdTier } from "@playatlas/common/domain";

export type ScoreEngineGroupTierThresholdPolicy = Record<EvidenceGroupThresholdTier, number>;

export const SCORE_ENGINE_DEFAULT_GROUP_TIER_THRESHOLD_POLICY = {
	strong: 0.7,
	moderate: 0.4,
} as const satisfies ScoreEngineGroupTierThresholdPolicy;
