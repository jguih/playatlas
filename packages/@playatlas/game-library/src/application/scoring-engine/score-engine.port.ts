import type { ClassificationId } from "@playatlas/common/domain";
import type { ScoreBreakdown } from "./score-breakdown";
import type { ScoreEngineVersion, ScoreResult, ScoringInput } from "./score-engine.types";

export type IScoreEnginePort<TGroup extends string> = {
	get id(): ClassificationId;
	get version(): ScoreEngineVersion;
	score(input: ScoringInput): ScoreResult<TGroup>;
	serializeBreakdown: (breakdown: ScoreBreakdown<TGroup>) => string;
};
