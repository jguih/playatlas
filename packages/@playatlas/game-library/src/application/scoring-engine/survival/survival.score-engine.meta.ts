import type { ScoreEngineVersion } from "../score-engine.types";

export const SURVIVAL_ENGINE_VERSION = "v1.0.0" as const satisfies ScoreEngineVersion;

export const SURVIVAL_ENGINE_EVIDENCE_GROUPS = ["core_survival"] as const satisfies string[];

export type SurvivalEvidenceGroup = (typeof SURVIVAL_ENGINE_EVIDENCE_GROUPS)[number];
