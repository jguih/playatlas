import { makeScoreEngine } from "../score-engine";
import type { IScoreEnginePort } from "../score-engine.port";
import {
	RUN_BASED_ENGINE_VERSION,
	type RunBasedEvidenceGroup,
} from "./run-based.score-engine.meta";

export type IRunBasedScoreEngine = IScoreEnginePort<RunBasedEvidenceGroup>;

export const makeRunBasedScoreEngine = (): IRunBasedScoreEngine => {
	const self = makeScoreEngine<RunBasedEvidenceGroup>({
		id: "RUN-BASED",
		version: RUN_BASED_ENGINE_VERSION,
	});

	return {
		...self,
		score: () => {
			return {
				mode: "without_gate",
				breakdown: {
					mode: "without_gate",
					groups: [],
					synergies: [],
					subtotal: 0,
					penalties: [],
					total: 0,
				},
				score: 0,
				normalizedScore: 0,
			};
		},
	};
};
