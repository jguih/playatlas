import type { ClassificationId } from "@playatlas/common/domain";
import { HORROR_ENGINE_EVIDENCE_GROUPS } from "./horror/horror.score-engine.meta";
import { RPG_ENGINE_EVIDENCE_GROUPS } from "./rpg";
import type { IScoreEnginePort } from "./score-engine.port";
import { SURVIVAL_ENGINE_EVIDENCE_GROUPS } from "./survival";

export const classificationGroupMap = {
	HORROR: HORROR_ENGINE_EVIDENCE_GROUPS,
	RPG: RPG_ENGINE_EVIDENCE_GROUPS,
	SURVIVAL: SURVIVAL_ENGINE_EVIDENCE_GROUPS,
} as const satisfies Record<ClassificationId, string[]>;

export type ClassificationGroupMap = {
	[K in keyof typeof classificationGroupMap]: (typeof classificationGroupMap)[K][number];
};

export type EnginesMap = {
	[K in keyof typeof classificationGroupMap]: IScoreEnginePort<ClassificationGroupMap[K]>;
};
