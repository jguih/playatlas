import type { ScoreEngineVersion } from "../score-engine.types";

export const RPG_ENGINE_VERSION = "v1.0.0" as const satisfies ScoreEngineVersion;

export const RPG_ENGINE_EVIDENCE_GROUPS = ["core_rpg"] as const satisfies string[];

export type RpgEvidenceGroup = (typeof RPG_ENGINE_EVIDENCE_GROUPS)[number];
