import { DEFAULT_GATE_STACK_POLICY, DEFAULT_NO_GATE_POLICY } from "../genre-scorer.constants";
import type { ClassificationGroupPolicy } from "../scorer.policy";
import type { IClassificationScoringPolicyPort } from "../scorer.ports";
import { makeScoringPolicy } from "../scoring-policy";
import type { HorrorEvidenceGroup } from "./horror.types";

export const HORROR_GROUP_POLICY: ClassificationGroupPolicy<HorrorEvidenceGroup> = {
	core_horror: { cap: 45 },
	survival_horror: { cap: 55 },
	psychological_horror: { cap: 55 },
	atmospheric_horror: { cap: 30 },
	cosmic_horror: { cap: 25 },
	synergy: { cap: 10 },
};

export type IHorrorScoringPolicyPort = IClassificationScoringPolicyPort<HorrorEvidenceGroup>;

export const makeHorrorScoringPolicy = (): IHorrorScoringPolicyPort =>
	makeScoringPolicy({
		gateStackPolicy: DEFAULT_GATE_STACK_POLICY,
		noGatePolicy: DEFAULT_NO_GATE_POLICY,
		groupPolicies: HORROR_GROUP_POLICY,
		maxScore: 100,
	});
