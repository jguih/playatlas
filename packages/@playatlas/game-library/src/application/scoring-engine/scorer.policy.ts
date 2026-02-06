import type { EvidenceTier } from "./scorer.types";

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
