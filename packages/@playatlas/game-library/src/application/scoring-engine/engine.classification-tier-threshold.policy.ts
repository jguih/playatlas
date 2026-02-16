import type { CanonicalClassificationThresholdTier } from "@playatlas/common/domain";

/**
 * Defines threshold for each classification tier. For example, given a game normalized score `Gns`, if `Gns` is greater than or equal to the `core` threshold, then the computed classification will get a classification tier of `core`.
 *
 * Thresholds don't change the scoring policy in any way. Classification tiers are semantic only.
 */
export type ScoreEngineClassificationTierThresholdPolicy = Record<
	CanonicalClassificationThresholdTier,
	number
>;
