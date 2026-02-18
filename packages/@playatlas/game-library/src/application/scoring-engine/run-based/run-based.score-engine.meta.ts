import type { ScoreEngineClassificationTierThresholdPolicy } from "../engine.classification-tier-threshold.policy";
import type { ScoreEngineEvidenceGroupPolicy } from "../engine.policy";
import type { ScoreEngineEvidenceGroupsMeta, ScoreEngineVersion } from "../score-engine.types";

export const RUN_BASED_ENGINE_VERSION = "v1.0.16" as const satisfies ScoreEngineVersion;

export const RUN_BASED_ENGINE_EVIDENCE_GROUPS = [
	"run_based_identity",
	"procedural_runs",
	"permadeath_reset",
	"run_variability",
	"meta_progression",
] as const satisfies string[];

export type RunBasedEvidenceGroup = (typeof RUN_BASED_ENGINE_EVIDENCE_GROUPS)[number];

export const RUN_BASED_ENGINE_EVIDENCE_GROUP_META = {
	run_based_identity: { userFacing: false, role: "identity" },
	procedural_runs: { userFacing: true, role: "dimension" },
	permadeath_reset: { userFacing: true, role: "dimension" },
	meta_progression: { userFacing: true, role: "dimension" },
	run_variability: { userFacing: true, role: "dimension" },
} as const satisfies ScoreEngineEvidenceGroupsMeta<RunBasedEvidenceGroup>;

export const RUN_BASED_ENGINE_EVIDENCE_GROUP_POLICY = {
	run_based_identity: { cap: 40 },
	procedural_runs: { cap: 50 },
	permadeath_reset: { cap: 30 },
	run_variability: { cap: 40 },
	meta_progression: { cap: 30 },
} as const satisfies ScoreEngineEvidenceGroupPolicy<RunBasedEvidenceGroup>;

export const RUN_BASED_ENGINE_CLASSIFICATION_TIER_THRESHOLD_POLICY = {
	adjacent: 0.07,
	strong: 0.3625,
	core: 0.49,
} as const satisfies ScoreEngineClassificationTierThresholdPolicy;
