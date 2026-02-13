import type { ScoreEngineEvidenceGroupsMeta, ScoreEngineVersion } from "../score-engine.types";

export const SURVIVAL_ENGINE_VERSION = "v1.0.1" as const satisfies ScoreEngineVersion;

export const SURVIVAL_ENGINE_EVIDENCE_GROUPS = ["survival_identity"] as const satisfies string[];

export type SurvivalEvidenceGroup = (typeof SURVIVAL_ENGINE_EVIDENCE_GROUPS)[number];

export const SURVIVAL_ENGINE_EVIDENCE_GROUP_META = {
	survival_identity: { userFacing: false, role: "identity" },
} as const satisfies ScoreEngineEvidenceGroupsMeta<SurvivalEvidenceGroup>;
