import { makeScoreEngine } from "../score-engine";
import type { IScoreEnginePort } from "../score-engine.port";
import { RPG_ENGINE_VERSION, type RpgEvidenceGroup } from "./rpg.score-engine.meta";

export type IRPGScoreEnginePort = IScoreEnginePort<RpgEvidenceGroup>;

export const makeRPGScoreEngine = (): IRPGScoreEnginePort => {
	const self = makeScoreEngine({ id: "RPG", version: RPG_ENGINE_VERSION });

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
