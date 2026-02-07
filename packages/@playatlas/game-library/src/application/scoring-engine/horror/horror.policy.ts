import { DEFAULT_GATE_STACK_POLICY, DEFAULT_NO_GATE_POLICY } from "../engine.policy";
import { makeScoringPolicy } from "../scoring-policy";
import type { IScoringPolicyPort } from "../scoring-policy.port";
import { HORROR_ENGINE_GROUP_POLICY, type HorrorEvidenceGroup } from "./horror.score-engine.meta";

export type IHorrorScoringPolicyPort = IScoringPolicyPort<HorrorEvidenceGroup>;

export const makeHorrorScoringPolicy = (): IHorrorScoringPolicyPort =>
	makeScoringPolicy({
		gateStackPolicy: DEFAULT_GATE_STACK_POLICY,
		noGatePolicy: DEFAULT_NO_GATE_POLICY,
		groupPolicies: HORROR_ENGINE_GROUP_POLICY,
		maxScore: 100,
	});
