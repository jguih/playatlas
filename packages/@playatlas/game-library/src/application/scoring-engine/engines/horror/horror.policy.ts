import { evidenceGroupTiers } from "@playatlas/common/domain";
import { penalizeTagOnly, type ScoreEngineGatePolicy } from "../../policy";
import { SCORE_ENGINE_DEFAULT_GROUP_TIER_THRESHOLD_POLICY } from "../../policy/group-tier-threshold.policy";
import { makeScoringPolicy } from "../../scoring-policy";
import type { IScoringPolicyPort } from "../../scoring-policy.port";
import {
	HORROR_ENGINE_CLASSIFICATION_TIER_THRESHOLD_POLICY,
	HORROR_ENGINE_EVIDENCE_GROUPS_META,
	HORROR_ENGINE_EVIDENCE_GROUP_POLICY,
	HORROR_ENGINE_EVIDENCE_SOURCE_POLICY,
	HORROR_ENGINE_SOURCE_PRIORITY_POLICY,
	type HorrorEvidenceGroup,
} from "./horror.score-engine.meta";

const horrorGatePolicy: ScoreEngineGatePolicy<HorrorEvidenceGroup> = {
	apply: ({ groupTierByGroup }) => {
		const rank = (g: HorrorEvidenceGroup): number =>
			evidenceGroupTiers.indexOf(groupTierByGroup.get(g) ?? "none");

		const identity = rank("horror_identity");
		const psychological = rank("psychological_horror");
		const atmospheric = rank("atmospheric_horror");
		const survival = rank("resource_survival");
		const combat = rank("combat_engagement");

		const coreMax = Math.max(identity, psychological);

		const gateScore = coreMax * 2 + atmospheric + survival + (combat >= 2 ? 0.5 : 0);

		if (gateScore >= 6) return { mode: "with_gate", confidenceMultiplier: 1 };

		if (gateScore >= 4) return { mode: "with_gate", confidenceMultiplier: 0.9 };

		return { mode: "without_gate", confidenceMultiplier: 0.8 };
	},
};

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
		gatePolicy: horrorGatePolicy,
	});
