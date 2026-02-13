import type { ClassificationGroupPolicy } from "../engine.policy";
import type { ScoreEngineVersion } from "../score-engine.types";

export const HORROR_ENGINE_VERSION = "v1.0.1" as const satisfies ScoreEngineVersion;

export const HORROR_ENGINE_EVIDENCE_GROUPS = [
	"core_horror",
	"survival_horror",
	"psychological_horror",
	"cosmic_horror",
	"atmospheric_horror",
] as const satisfies string[];

export type HorrorEvidenceGroup = (typeof HORROR_ENGINE_EVIDENCE_GROUPS)[number];

export const HORROR_ENGINE_GROUP_POLICY: ClassificationGroupPolicy<HorrorEvidenceGroup> = {
	core_horror: { cap: 45 },
	survival_horror: { cap: 55 },
	psychological_horror: { cap: 55 },
	atmospheric_horror: { cap: 40 },
	cosmic_horror: { cap: 40 },
};
