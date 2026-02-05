import type { Evidence, GenreGroupPolicy } from "../genre-scorer.types";

export type HorrorEvidenceGroup =
	| "core_horror"
	| "survival_horror"
	| "psychological_horror"
	| "cosmic_horror"
	| "atmospheric_horror"
	| "synergy";

export type HorrorEvidence = Evidence<HorrorEvidenceGroup>;

export type HorrorGroupPolicy = GenreGroupPolicy<HorrorEvidenceGroup>;
