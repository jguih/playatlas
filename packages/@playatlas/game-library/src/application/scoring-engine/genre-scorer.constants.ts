import type { GateStackPolicy, NoGatePolicy } from "./scorer.policy";

export const DEFAULT_NO_GATE_POLICY = {
	tierPenalty: {
		A: 0.6,
		B: 0.75,
		C: 0.95,
	},
} as const satisfies NoGatePolicy;

export const DEFAULT_GATE_STACK_POLICY = {
	diminishingMultipliers: [1.0, 0.7],
	tailMultiplier: 0.3,
} as const satisfies GateStackPolicy;
