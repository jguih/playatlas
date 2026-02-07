import type { ClassificationGroupMap, EnginesMap } from "./engine.registry.types";
import { type IHorrorScoreEnginePort } from "./horror";
import type { IRPGScoreEnginePort } from "./rpg";
import type { IScoreEnginePort } from "./score-engine.port";
import type { ISurvivalScoreEnginePort } from "./survival";

export type IScoreEngineRegistryPort = {
	get: <C extends keyof ClassificationGroupMap>(
		classificationId: C,
	) => IScoreEnginePort<ClassificationGroupMap[C]>;
};

export type ScoreEngineRegistryDeps = {
	horrorScoreEngine: IHorrorScoreEnginePort;
	rpgScoreEngine: IRPGScoreEnginePort;
	survivalScoreEngine: ISurvivalScoreEnginePort;
};

export const makeScoreEngineRegistry = ({
	horrorScoreEngine,
	rpgScoreEngine,
	survivalScoreEngine,
}: ScoreEngineRegistryDeps): IScoreEngineRegistryPort => {
	const engines: EnginesMap = {
		HORROR: horrorScoreEngine,
		RPG: rpgScoreEngine,
		SURVIVAL: survivalScoreEngine,
	};

	return {
		get: (classificationId) => {
			return engines[classificationId];
		},
	};
};
