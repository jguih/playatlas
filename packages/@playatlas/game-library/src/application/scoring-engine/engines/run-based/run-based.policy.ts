import { SCORE_ENGINE_DEFAULT_GROUP_TIER_THRESHOLD_POLICY } from "../../policy/group-tier-threshold.policy";
import { makeScoringPolicy } from "../../scoring-policy";
import type { IScoringPolicyPort } from "../../scoring-policy.port";
import {
	RUN_BASED_ENGINE_CLASSIFICATION_TIER_THRESHOLD_POLICY,
	RUN_BASED_ENGINE_EVIDENCE_GROUP_META,
	RUN_BASED_ENGINE_EVIDENCE_GROUP_POLICY,
	RUN_BASED_ENGINE_EVIDENCE_SOURCE_POLICY,
	RUN_BASED_ENGINE_GATE_POLICY,
	RUN_BASED_ENGINE_SOURCE_PRIORITY_POLICY,
	type RunBasedEvidenceGroup,
} from "./run-based.score-engine.meta";

export type IRunBasedScoringPolicyPort = IScoringPolicyPort<RunBasedEvidenceGroup>;

export const makeRunBasedScoringPolicy = (): IRunBasedScoringPolicyPort =>
	makeScoringPolicy({
		scoreCap: 100,
		evidenceGroupMeta: RUN_BASED_ENGINE_EVIDENCE_GROUP_META,
		evidenceGroupPolicies: RUN_BASED_ENGINE_EVIDENCE_GROUP_POLICY,
		classificationTierThresholdPolicy: RUN_BASED_ENGINE_CLASSIFICATION_TIER_THRESHOLD_POLICY,
		groupTierThresholdPolicy: SCORE_ENGINE_DEFAULT_GROUP_TIER_THRESHOLD_POLICY,
		evidenceSourcePolicy: RUN_BASED_ENGINE_EVIDENCE_SOURCE_POLICY,
		structuralPenaltyPolicies: [],
		gatePolicy: RUN_BASED_ENGINE_GATE_POLICY,
		sourcePriorityPolicy: RUN_BASED_ENGINE_SOURCE_PRIORITY_POLICY,
	});
