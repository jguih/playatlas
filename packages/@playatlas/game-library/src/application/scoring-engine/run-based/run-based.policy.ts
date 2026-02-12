import {
	SCORE_ENGINE_DEFAULT_GATE_STACK_POLICY,
	SCORE_ENGINE_DEFAULT_MAX_NO_GATE_SCORE,
	SCORE_ENGINE_DEFAULT_MAX_SCORE,
	SCORE_ENGINE_DEFAULT_NO_GATE_POLICY,
} from "../engine.policy";
import { makeScoringPolicy } from "../scoring-policy";
import type { IScoringPolicyPort } from "../scoring-policy.port";
import {
	RUN_BASED_ENGINE_GROUP_POLICY,
	type RunBasedEvidenceGroup,
} from "./run-based.score-engine.meta";

export type IRunBasedScoringPolicyPort = IScoringPolicyPort<RunBasedEvidenceGroup>;

export const makeRunBasedScoringPolicy = (): IRunBasedScoringPolicyPort =>
	makeScoringPolicy({
		gateStackPolicy: SCORE_ENGINE_DEFAULT_GATE_STACK_POLICY,
		noGatePolicy: SCORE_ENGINE_DEFAULT_NO_GATE_POLICY,
		maxScore: SCORE_ENGINE_DEFAULT_MAX_SCORE,
		maxNoGateScore: SCORE_ENGINE_DEFAULT_MAX_NO_GATE_SCORE,
		groupPolicies: RUN_BASED_ENGINE_GROUP_POLICY,
	});
