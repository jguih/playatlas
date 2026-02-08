import { type ClassificationId } from "@playatlas/common/domain";
import { ScoreEngineSerializationError } from "../../../domain";
import { scoreBreakdownSchema, type ScoreBreakdown } from "../score-breakdown";
import type { IScoreEnginePort, ScoreEngineBaseDeps } from "../score-engine.port";
import { RPG_ENGINE_VERSION, type RpgEvidenceGroup } from "./rpg.score-engine.meta";

export type IRPGScoreEnginePort = IScoreEnginePort<RpgEvidenceGroup>;

export type RPGScoreEngineDeps = ScoreEngineBaseDeps;

export const makeRPGScoreEngine = ({
	engineVersion,
}: RPGScoreEngineDeps = {}): IRPGScoreEnginePort => {
	const classificationId: ClassificationId = "RPG";
	const version = engineVersion ?? RPG_ENGINE_VERSION;

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
			return breakdown as unknown as ScoreBreakdown<RpgEvidenceGroup>;
		},
		serializeBreakdown: (breakdown) => {
			return JSON.stringify(breakdown, null, 2);
		},
	};
};
