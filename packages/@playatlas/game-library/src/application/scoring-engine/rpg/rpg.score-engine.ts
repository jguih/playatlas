import { ClassificationIdParser } from "@playatlas/common/domain";
import type { IScoreEnginePort } from "../score-engine.port";
import type { RpgEvidenceGroup } from "./rpg.groups";

export type IRPGScoreEnginePort = IScoreEnginePort<RpgEvidenceGroup>;

export const makeRPGScoreEngine = (): IRPGScoreEnginePort => {
	return {
		id: ClassificationIdParser.fromTrusted("RPG"),
		score: () => {
			throw new Error("Not Implemented");
		},
		deserializeBreakdown: () => {
			throw new Error("Not Implemented");
		},
		serializeBreakdown: () => {
			throw new Error("Not Implemented");
		},
	};
};
