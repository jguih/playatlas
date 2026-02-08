import type { EvidenceTier } from "@playatlas/common/domain";

export type GroupPolicy = {
	cap?: number;
	multiplier?: number;
};

export type ClassificationGroupPolicy<TGroup extends string> = Record<TGroup, GroupPolicy>;

export type NoGatePolicy = {
	/**
	 * Penalty applied when no gates were found.
	 * In this case, only the strongest evidence is considered by the engine.
	 * The `tierPenalty` defines a penalty applied to the chosen evidence weight based on its `tier`.
	 */
	tierPenalty: Record<EvidenceTier, number>;
};

export type GateStackPolicy = {
	diminishingMultipliers: number[];
	tailMultiplier: number;
};

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
