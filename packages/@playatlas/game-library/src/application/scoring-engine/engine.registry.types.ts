import type { classificationGroupMap } from "./engine.registry";
import type { IScoreEnginePort } from "./score-engine.port";

export type ClassificationGroupMap = {
	[K in keyof typeof classificationGroupMap]: (typeof classificationGroupMap)[K][number];
};

export type EnginesMap = {
	[K in keyof typeof classificationGroupMap]: IScoreEnginePort<ClassificationGroupMap[K]>;
};
