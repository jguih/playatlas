import { SCORE_ENGINE_DEFAULT_EVIDENCE_SOURCE_POLICY } from "../engine.evidence-source.policy";
import {
	SCORE_ENGINE_DEFAULT_GATE_STACK_POLICY,
	SCORE_ENGINE_DEFAULT_NO_GATE_POLICY,
} from "../engine.policy";
import { SCORE_ENGINE_DEFAULT_SCORE_CEILING_POLICY } from "../engine.score-ceiling.policy";
import { makeScoringPolicy } from "../scoring-policy";
import type { IScoringPolicyPort } from "../scoring-policy.port";
import {
	RUN_BASED_ENGINE_EVIDENCE_GROUP_META,
	RUN_BASED_ENGINE_EVIDENCE_GROUP_POLICY,
	type RunBasedEvidenceGroup,
} from "./run-based.score-engine.meta";

export type IRunBasedScoringPolicyPort = IScoringPolicyPort<RunBasedEvidenceGroup>;

export const makeRunBasedScoringPolicy = (): IRunBasedScoringPolicyPort =>
	makeScoringPolicy({
		evidenceGroupMeta: RUN_BASED_ENGINE_EVIDENCE_GROUP_META,
		evidenceGroupPolicies: RUN_BASED_ENGINE_EVIDENCE_GROUP_POLICY,
		gateStackPolicy: SCORE_ENGINE_DEFAULT_GATE_STACK_POLICY,
		noGatePolicy: SCORE_ENGINE_DEFAULT_NO_GATE_POLICY,
		evidenceSourcePolicy: SCORE_ENGINE_DEFAULT_EVIDENCE_SOURCE_POLICY,
		scoreCeilingPolicy: SCORE_ENGINE_DEFAULT_SCORE_CEILING_POLICY,
	});
