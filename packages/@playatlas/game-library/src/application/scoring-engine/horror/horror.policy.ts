import { SCORE_ENGINE_DEFAULT_EVIDENCE_SOURCE_POLICY } from "../engine.evidence-source.policy";
import {
	SCORE_ENGINE_DEFAULT_GATE_STACK_POLICY,
	SCORE_ENGINE_DEFAULT_NO_GATE_POLICY,
} from "../engine.policy";
import { SCORE_ENGINE_DEFAULT_SCORE_CEILING_POLICY } from "../engine.score-ceiling.policy";
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
		evidenceGroupMeta: HORROR_ENGINE_EVIDENCE_GROUPS_META,
		evidenceGroupPolicies: HORROR_ENGINE_EVIDENCE_GROUP_POLICY,
		gateStackPolicy: SCORE_ENGINE_DEFAULT_GATE_STACK_POLICY,
		noGatePolicy: SCORE_ENGINE_DEFAULT_NO_GATE_POLICY,
		evidenceSourcePolicy: SCORE_ENGINE_DEFAULT_EVIDENCE_SOURCE_POLICY,
		scoreCeilingPolicy: SCORE_ENGINE_DEFAULT_SCORE_CEILING_POLICY,
	});
