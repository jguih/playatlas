import type { ClassificationId } from "@playatlas/common/domain";
import type { ClassificationGroupMap, EnginesMap } from "./engine.registry.types";
import { type IHorrorScoreEnginePort } from "./horror";
import { HORROR_ENGINE_EVIDENCE_GROUPS } from "./horror/horror.score-engine.meta";
import { RUN_BASED_ENGINE_EVIDENCE_GROUPS, type IRunBasedScoreEngine } from "./run-based";
import type { IScoreEnginePort } from "./score-engine.port";
import { SURVIVAL_ENGINE_EVIDENCE_GROUPS, type ISurvivalScoreEnginePort } from "./survival";

export const classificationGroupMap = {
	HORROR: HORROR_ENGINE_EVIDENCE_GROUPS,
	"RUN-BASED": RUN_BASED_ENGINE_EVIDENCE_GROUPS,
	SURVIVAL: SURVIVAL_ENGINE_EVIDENCE_GROUPS,
} as const satisfies Record<ClassificationId, string[]>;

export type IScoreEngineRegistryPort = {
	get: <C extends ClassificationId>(
		classificationId: C,
	) => IScoreEnginePort<ClassificationGroupMap[C]>;
	list: () => EnginesMap;
};

export type ScoreEngineRegistryDeps = {
	horrorScoreEngine: IHorrorScoreEnginePort;
	runBasedScoreEngine: IRunBasedScoreEngine;
	survivalScoreEngine: ISurvivalScoreEnginePort;
};

export const makeScoreEngineRegistry = ({
	horrorScoreEngine,
	runBasedScoreEngine,
	survivalScoreEngine,
}: ScoreEngineRegistryDeps): IScoreEngineRegistryPort => {
	const engines: EnginesMap = {
		HORROR: horrorScoreEngine,
		"RUN-BASED": runBasedScoreEngine,
		SURVIVAL: survivalScoreEngine,
	};

	return {
		get: (classificationId) => {
			return engines[classificationId];
		},
		list: () => engines,
	};
};
