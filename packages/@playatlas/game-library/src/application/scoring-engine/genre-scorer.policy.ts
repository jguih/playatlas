import type { EvidenceTier } from "./genre-scorer.types";

export type GroupPolicy = {
	cap?: number;
	multiplier?: number;
};

export type GenreGroupPolicy<TGroup extends string> = Record<TGroup, GroupPolicy>;

export type NoGatePolicy = {
	tierPenalty: Record<EvidenceTier, number>;
};

export type GateStackPolicy = {
	diminishingMultipliers: number[];
	tailMultiplier: number;
};
