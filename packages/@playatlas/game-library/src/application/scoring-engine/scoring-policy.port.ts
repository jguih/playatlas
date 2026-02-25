import type { Evidence } from "./evidence.types";
import type { ScoreResult } from "./score-engine.types";

export interface IScoringPolicyPort<TGroup extends string> {
	apply(evidence: Evidence<TGroup>[]): ScoreResult<TGroup>;
}
