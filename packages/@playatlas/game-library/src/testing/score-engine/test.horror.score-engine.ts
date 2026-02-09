import { makeScoreEngine, type IScoreEnginePort, type ScoreEngineVersion } from "../../application";
import {
	HORROR_ENGINE_VERSION,
	type HorrorEvidenceGroup,
} from "../../application/scoring-engine/horror/horror.score-engine.meta";

export type ITestHorrorScoreEnginePort = IScoreEnginePort<HorrorEvidenceGroup> & {
	setScore: (s: number) => void;
	setVersion: (v: ScoreEngineVersion) => void;
};

export const makeTestHorrorScoreEngine = (): ITestHorrorScoreEnginePort => {
	let version: ScoreEngineVersion = HORROR_ENGINE_VERSION;
	let score = 0;

	const self = makeScoreEngine({ id: "HORROR", version });

	return {
		...self,
		get version() {
			return version;
		},
		score: () => {
			return {
				score,
				normalizedScore: 0,
				mode: "without_gate",
				breakdown: {
					mode: "without_gate",
					groups: [],
					synergies: [],
					penalties: [],
					subtotal: score,
					total: score,
				},
			};
		},
		setScore: (s) => (score = s),
		setVersion: (v) => (version = v),
	};
};
