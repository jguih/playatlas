import type { ScoreEngineSourcePolicy } from "../../engine.evidence-source.policy";
import type { ScoreEngineEvidenceGroupPolicy } from "../../engine.policy";
import {
	SCORE_ENGINE_DEFAULT_SOURCE_PRIORITY,
	type ScoreEngineSourcePriorityPolicy,
} from "../../policy";
import type { ScoreEngineClassificationTierThresholdPolicy } from "../../policy/classification-tier-threshold.policy";
import type { ScoreEngineEvidenceGroupsMeta, ScoreEngineVersion } from "../../score-engine.types";

export const HORROR_ENGINE_VERSION = "v1.0.24" as const satisfies ScoreEngineVersion;

export const HORROR_ENGINE_EVIDENCE_GROUPS = [
	"horror_identity",
	"atmospheric_horror",
	"combat_engagement",
	"psychological_horror",
	"resource_survival",
] as const satisfies string[];

export type HorrorEvidenceGroup = (typeof HORROR_ENGINE_EVIDENCE_GROUPS)[number];

export const HORROR_ENGINE_EVIDENCE_GROUPS_META = {
	horror_identity: { userFacing: false, role: "identity" },
	atmospheric_horror: { userFacing: true, role: "dimension" },
	combat_engagement: { userFacing: true, role: "dimension" },
	psychological_horror: { userFacing: true, role: "dimension" },
	resource_survival: { userFacing: true, role: "dimension" },
} as const satisfies ScoreEngineEvidenceGroupsMeta<HorrorEvidenceGroup>;

export const HORROR_ENGINE_EVIDENCE_GROUP_POLICY = {
	horror_identity: { cap: 40 },
	atmospheric_horror: { cap: 50 },
	combat_engagement: { cap: 30 },
	psychological_horror: { cap: 50 },
	resource_survival: { cap: 30 },
} as const satisfies ScoreEngineEvidenceGroupPolicy<HorrorEvidenceGroup>;

export const HORROR_ENGINE_CLASSIFICATION_TIER_THRESHOLD_POLICY = {
	adjacent: 0.198,
	strong: 0.3564,
	core: 0.723,
} as const satisfies ScoreEngineClassificationTierThresholdPolicy;

export const HORROR_ENGINE_EVIDENCE_SOURCE_POLICY = {
	horror_identity: {
		genre: { cap: Infinity, multiplier: 1.2 },
		tag: { cap: Infinity, multiplier: 1.1 },
		text: { cap: 10, multiplier: 0.6 },
	},
	atmospheric_horror: {
		text: { cap: Infinity },
		genre: { cap: Infinity, multiplier: 0.8 },
		tag: { cap: 20, multiplier: 0.8 },
	},
	combat_engagement: {
		text: { cap: Infinity },
		genre: { cap: Infinity, multiplier: 0.8 },
		tag: { cap: 10, multiplier: 0.6 },
	},
	psychological_horror: {
		genre: { cap: Infinity, multiplier: 1.2 },
		tag: { cap: Infinity, multiplier: 1.1 },
		text: { cap: Infinity, multiplier: 0.8 },
	},
	resource_survival: {
		tag: { cap: Infinity },
		genre: { cap: Infinity, multiplier: 0.9 },
		text: { cap: Infinity, multiplier: 0.8 },
	},
} as const satisfies ScoreEngineSourcePolicy<HorrorEvidenceGroup>;

export const HORROR_ENGINE_SOURCE_PRIORITY_POLICY = {
	horror_identity: {
		genre: 3,
		tag: 2,
		text: 1,
	},
	atmospheric_horror: SCORE_ENGINE_DEFAULT_SOURCE_PRIORITY,
	combat_engagement: SCORE_ENGINE_DEFAULT_SOURCE_PRIORITY,
	psychological_horror: SCORE_ENGINE_DEFAULT_SOURCE_PRIORITY,
	resource_survival: SCORE_ENGINE_DEFAULT_SOURCE_PRIORITY,
} as const satisfies ScoreEngineSourcePriorityPolicy<HorrorEvidenceGroup>;
