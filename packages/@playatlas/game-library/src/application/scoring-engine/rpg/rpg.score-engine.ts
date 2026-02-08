import { type ClassificationId } from "@playatlas/common/domain";
import { ScoreEngineSerializationError } from "../../../domain";
import { scoreBreakdownSchema, type ScoreBreakdown } from "../score-breakdown";
import type { IScoreEnginePort } from "../score-engine.port";
import { RPG_ENGINE_VERSION, type RpgEvidenceGroup } from "./rpg.score-engine.meta";

export type IRPGScoreEnginePort = IScoreEnginePort<RpgEvidenceGroup>;

export const makeRPGScoreEngine = (): IRPGScoreEnginePort => {
	const classificationId: ClassificationId = "RPG";

	return {
		id: classificationId,
		version: RPG_ENGINE_VERSION,
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
					{ engineVersion: RPG_ENGINE_VERSION, classificationId },
					error,
				);
			return breakdown as unknown as ScoreBreakdown<RpgEvidenceGroup>;
		},
		serializeBreakdown: (breakdown) => {
			return JSON.stringify(breakdown, null, 2);
		},
	};
};
