import { makeScoreEngine } from "../score-engine";
import type { IScoreEnginePort } from "../score-engine.port";
import { SURVIVAL_ENGINE_VERSION, type SurvivalEvidenceGroup } from "./survival.score-engine.meta";

export type ISurvivalScoreEnginePort = IScoreEnginePort<SurvivalEvidenceGroup>;

export const makeSurvivalScoreEngine = (): ISurvivalScoreEnginePort => {
	const self = makeScoreEngine({ id: "SURVIVAL", version: SURVIVAL_ENGINE_VERSION });

	return {
		...self,
		score: () => {
			return {
				score: 0,
				normalizedScore: 0,
				mode: "without_gate",
				breakdown: {
					mode: "without_gate",
					groups: [],
					synergies: [],
					penalties: [],
					subtotal: 0,
					total: 0,
				},
			};
		},
	};
};
