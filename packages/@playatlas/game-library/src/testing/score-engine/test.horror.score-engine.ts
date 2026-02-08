import type { ClassificationId } from "@playatlas/common/domain";
import {
	scoreBreakdownSchema,
	type IScoreEnginePort,
	type ScoreBreakdown,
	type ScoreEngineVersion,
} from "../../application";
import {
	HORROR_ENGINE_VERSION,
	type HorrorEvidenceGroup,
} from "../../application/scoring-engine/horror/horror.score-engine.meta";
import { ScoreEngineSerializationError } from "../../domain";

export type ITestHorrorScoreEnginePort = IScoreEnginePort<HorrorEvidenceGroup> & {
	setScore: (s: number) => void;
	setVersion: (v: ScoreEngineVersion) => void;
};

export const makeTestHorrorScoreEngine = (): ITestHorrorScoreEnginePort => {
	const classificationId: ClassificationId = "HORROR";
	let version: ScoreEngineVersion = HORROR_ENGINE_VERSION;
	let score = 0;

	return {
		get id() {
			return classificationId;
		},
		get version() {
			return version;
		},
		score: () => {
			return {
				score,
				breakdown: {
					mode: "without_gate",
					groups: [],
					synergy: { contribution: 0, details: "" },
					penalties: [],
					subtotal: score,
					total: score,
				},
			};
		},
		deserializeBreakdown: (json) => {
			const { success, data: breakdown, error } = scoreBreakdownSchema.safeParse(JSON.parse(json));
			if (!success)
				throw new ScoreEngineSerializationError(
					"Failed to deserialize score engine breakdown JSON string",
					{ engineVersion: version, classificationId },
					error,
				);
			return breakdown as unknown as ScoreBreakdown<HorrorEvidenceGroup>;
		},
		serializeBreakdown: (breakdown) => {
			return JSON.stringify(breakdown, null, 2);
		},
		setScore: (s) => (score = s),
		setVersion: (v) => (version = v),
	};
};
