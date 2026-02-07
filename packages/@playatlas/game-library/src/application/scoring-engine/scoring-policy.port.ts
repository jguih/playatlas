import type { Evidence } from "./evidence";
import type { ScoreResult } from "./score-engine.port";

export interface IScoringPolicyPort<TGroup extends string> {
	apply(evidence: Evidence<TGroup>[]): ScoreResult<TGroup>;
}
