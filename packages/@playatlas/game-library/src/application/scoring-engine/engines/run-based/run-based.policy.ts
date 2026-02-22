import { evidenceGroupTiers } from "@playatlas/common/domain";
import { SCORE_ENGINE_DEFAULT_EVIDENCE_SOURCE_POLICY } from "../../engine.evidence-source.policy";
import { type ScoreEngineGatePolicy } from "../../policy";
import { SCORE_ENGINE_DEFAULT_GROUP_TIER_THRESHOLD_POLICY } from "../../policy/group-tier-threshold.policy";
import { makeScoringPolicy } from "../../scoring-policy";
import type { IScoringPolicyPort } from "../../scoring-policy.port";
import {
	RUN_BASED_ENGINE_CLASSIFICATION_TIER_THRESHOLD_POLICY,
	RUN_BASED_ENGINE_EVIDENCE_GROUP_META,
	RUN_BASED_ENGINE_EVIDENCE_GROUP_POLICY,
	type RunBasedEvidenceGroup,
} from "./run-based.score-engine.meta";

const runBasedGatePolicy: ScoreEngineGatePolicy<RunBasedEvidenceGroup> = {
	apply: ({ groupTierByGroup }) => {
		const rank = (g: RunBasedEvidenceGroup): number =>
			evidenceGroupTiers.indexOf(groupTierByGroup.get(g) ?? "none");

		const identity = rank("run_based_identity");
		const procedural = rank("procedural_runs");
		const permadeath = rank("permadeath_reset");
		const runVariability = rank("run_variability");
		const metaProgression = rank("meta_progression");

		const gateScore =
			identity * 2 + procedural + permadeath + runVariability + (metaProgression >= 2 ? 1 : 0);

		if (gateScore >= 9) return { mode: "with_gate", confidenceMultiplier: 1 };

		if (gateScore >= 6) return { mode: "with_gate", confidenceMultiplier: 0.7 };

		return { mode: "without_gate", confidenceMultiplier: 0.5 };
	},
};

export type IRunBasedScoringPolicyPort = IScoringPolicyPort<RunBasedEvidenceGroup>;

export const makeRunBasedScoringPolicy = (): IRunBasedScoringPolicyPort =>
	makeScoringPolicy({
		scoreCap: 100,
		evidenceGroupMeta: RUN_BASED_ENGINE_EVIDENCE_GROUP_META,
		evidenceGroupPolicies: RUN_BASED_ENGINE_EVIDENCE_GROUP_POLICY,
		classificationTierThresholdPolicy: RUN_BASED_ENGINE_CLASSIFICATION_TIER_THRESHOLD_POLICY,
		groupTierThresholdPolicy: SCORE_ENGINE_DEFAULT_GROUP_TIER_THRESHOLD_POLICY,
		evidenceSourcePolicy: SCORE_ENGINE_DEFAULT_EVIDENCE_SOURCE_POLICY,
		structuralPenaltyPolicies: [],
		gatePolicy: runBasedGatePolicy,
	});
