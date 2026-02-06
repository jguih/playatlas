import type { EvidenceTier } from "./genre-scorer.types";

export type TextSignalItem<TGroup> = {
	phrase: string;
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	isGate: boolean;
};

export type GenreSignalItem<TGroup> = {
	name: string | string[];
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	isGate: boolean;
};
