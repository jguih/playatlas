import type { ClassificationId } from "@playatlas/common/domain";
import { horrorEvidenceGroups } from "./horror";
import { rpgEvidenceGroups } from "./rpg";
import type { IScoreEnginePort } from "./score-engine.port";
import { survivalEvidenceGroups } from "./survival";

export const classificationGroupMap = {
	HORROR: horrorEvidenceGroups,
	RPG: rpgEvidenceGroups,
	SURVIVAL: survivalEvidenceGroups,
} as const satisfies Record<ClassificationId, string[]>;

export type ClassificationGroupMap = {
	[K in keyof typeof classificationGroupMap]: (typeof classificationGroupMap)[K][number];
};

export type EnginesMap = {
	[K in keyof typeof classificationGroupMap]: IScoreEnginePort<ClassificationGroupMap[K]>;
};
