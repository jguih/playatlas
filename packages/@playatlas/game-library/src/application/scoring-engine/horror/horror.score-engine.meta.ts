import type { ScoreEngineEvidenceGroupPolicy } from "../engine.policy";
import type { ScoreEngineEvidenceGroupsMeta, ScoreEngineVersion } from "../score-engine.types";

export const HORROR_ENGINE_VERSION = "v1.0.4" as const satisfies ScoreEngineVersion;

export const HORROR_ENGINE_EVIDENCE_GROUPS = [
	"horror_identity",
	"combat_engagement",
	"resource_survival",
	"psychological_horror",
	"atmospheric_horror",
] as const satisfies string[];

export type HorrorEvidenceGroup = (typeof HORROR_ENGINE_EVIDENCE_GROUPS)[number];

export const HORROR_ENGINE_EVIDENCE_GROUPS_META = {
	horror_identity: { userFacing: false, role: "identity" },
	combat_engagement: { userFacing: true, role: "dimension" },
	resource_survival: { userFacing: true, role: "dimension" },
	psychological_horror: { userFacing: true, role: "dimension" },
	atmospheric_horror: { userFacing: true, role: "dimension" },
} as const satisfies ScoreEngineEvidenceGroupsMeta<HorrorEvidenceGroup>;

export const HORROR_ENGINE_EVIDENCE_GROUP_POLICY = {
	horror_identity: { cap: 40 },
	combat_engagement: { cap: 30 },
	resource_survival: { cap: 30 },
	psychological_horror: { cap: 50 },
	atmospheric_horror: { cap: 50 },
} as const satisfies ScoreEngineEvidenceGroupPolicy<HorrorEvidenceGroup>;
