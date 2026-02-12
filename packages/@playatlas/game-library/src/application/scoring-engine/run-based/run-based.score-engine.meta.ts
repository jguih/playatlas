import type { ScoreEngineVersion } from "../score-engine.types";

export const RUN_BASED_ENGINE_VERSION = "v1.0.0" as const satisfies ScoreEngineVersion;

export const RUN_BASED_ENGINE_EVIDENCE_GROUPS = [
	"procedural_runs",
	"permadeath_reset",
	"run_variability",
	"meta_progression",
] as const satisfies string[];

export type RunBasedEvidenceGroup = (typeof RUN_BASED_ENGINE_EVIDENCE_GROUPS)[number];
