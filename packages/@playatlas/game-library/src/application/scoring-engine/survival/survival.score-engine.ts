import { type ClassificationId } from "@playatlas/common/domain";
import { ScoreEngineSerializationError } from "../../../domain";
import { scoreBreakdownSchema, type ScoreBreakdown } from "../score-breakdown";
import type { IScoreEnginePort, ScoreEngineBaseDeps } from "../score-engine.port";
import { SURVIVAL_ENGINE_VERSION, type SurvivalEvidenceGroup } from "./survival.score-engine.meta";

export type ISurvivalScoreEnginePort = IScoreEnginePort<SurvivalEvidenceGroup>;

export type SurvivalScoreEngineDeps = ScoreEngineBaseDeps;

export const makeSurvivalScoreEngine = ({
	engineVersion,
}: SurvivalScoreEngineDeps = {}): ISurvivalScoreEnginePort => {
	const classificationId: ClassificationId = "SURVIVAL";
	const version = engineVersion ?? SURVIVAL_ENGINE_VERSION;

	return {
		id: classificationId,
		version,
		score: () => {
			return {
				score: 0,
				breakdown: {
					mode: "without_gate",
					groups: [],
					synergy: { contribution: 0, details: "" },
					penalties: [],
					subtotal: 0,
					total: 0,
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
			return breakdown as unknown as ScoreBreakdown<SurvivalEvidenceGroup>;
		},
		serializeBreakdown: (breakdown) => {
			return JSON.stringify(breakdown, null, 2);
		},
	};
};
