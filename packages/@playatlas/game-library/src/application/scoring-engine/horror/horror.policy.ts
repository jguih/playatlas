import {
	SCORE_ENGINE_DEFAULT_GATE_STACK_POLICY,
	SCORE_ENGINE_DEFAULT_MAX_NO_GATE_SCORE,
	SCORE_ENGINE_DEFAULT_MAX_SCORE,
	SCORE_ENGINE_DEFAULT_NO_GATE_POLICY,
} from "../engine.policy";
import { makeScoringPolicy } from "../scoring-policy";
import type { IScoringPolicyPort } from "../scoring-policy.port";
import {
	HORROR_ENGINE_EVIDENCE_GROUPS_META,
	HORROR_ENGINE_EVIDENCE_GROUP_POLICY,
	type HorrorEvidenceGroup,
} from "./horror.score-engine.meta";

export type IHorrorScoringPolicyPort = IScoringPolicyPort<HorrorEvidenceGroup>;

export const makeHorrorScoringPolicy = (): IHorrorScoringPolicyPort =>
	makeScoringPolicy({
		evidenceGroupPolicies: HORROR_ENGINE_EVIDENCE_GROUP_POLICY,
		evidenceGroupMeta: HORROR_ENGINE_EVIDENCE_GROUPS_META,
		gateStackPolicy: SCORE_ENGINE_DEFAULT_GATE_STACK_POLICY,
		noGatePolicy: SCORE_ENGINE_DEFAULT_NO_GATE_POLICY,
		maxScore: SCORE_ENGINE_DEFAULT_MAX_SCORE,
		maxNoGateScore: SCORE_ENGINE_DEFAULT_MAX_NO_GATE_SCORE,
	});
