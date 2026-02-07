import { ClassificationIdParser } from "@playatlas/common/domain";
import type { IScoreEnginePort } from "../score-engine.port";
import type { SurvivalEvidenceGroup } from "./survival.groups";

export type ISurvivalScoreEnginePort = IScoreEnginePort<SurvivalEvidenceGroup>;

export const makeSurvivalScoreEngine = (): ISurvivalScoreEnginePort => {
	return {
		id: ClassificationIdParser.fromTrusted("SURVIVAL"),
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
