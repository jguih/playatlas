import { penalizeTagOnly } from "../../policy";
import { SCORE_ENGINE_DEFAULT_GROUP_TIER_THRESHOLD_POLICY } from "../../policy/group-tier-threshold.policy";
import { makeScoringPolicy } from "../../scoring-policy";
import type { IScoringPolicyPort } from "../../scoring-policy.port";
import {
	HORROR_ENGINE_CLASSIFICATION_TIER_THRESHOLD_POLICY,
	HORROR_ENGINE_EVIDENCE_GROUPS_META,
	HORROR_ENGINE_EVIDENCE_GROUP_POLICY,
	HORROR_ENGINE_EVIDENCE_SOURCE_POLICY,
	HORROR_ENGINE_GATE_POLICY,
	HORROR_ENGINE_SOURCE_PRIORITY_POLICY,
	type HorrorEvidenceGroup,
} from "./horror.score-engine.meta";

export type IHorrorScoringPolicyPort = IScoringPolicyPort<HorrorEvidenceGroup>;

export const makeHorrorScoringPolicy = (): IHorrorScoringPolicyPort =>
	makeScoringPolicy({
		scoreCap: 100,
		evidenceGroupMeta: HORROR_ENGINE_EVIDENCE_GROUPS_META,
		evidenceGroupPolicies: HORROR_ENGINE_EVIDENCE_GROUP_POLICY,
		sourcePriorityPolicy: HORROR_ENGINE_SOURCE_PRIORITY_POLICY,
		classificationTierThresholdPolicy: HORROR_ENGINE_CLASSIFICATION_TIER_THRESHOLD_POLICY,
		groupTierThresholdPolicy: SCORE_ENGINE_DEFAULT_GROUP_TIER_THRESHOLD_POLICY,
		evidenceSourcePolicy: HORROR_ENGINE_EVIDENCE_SOURCE_POLICY,
		structuralPenaltyPolicies: [penalizeTagOnly()],
		gatePolicy: HORROR_ENGINE_GATE_POLICY,
	});
