import type { CanonicalGenreId, ScoringInput } from "../../types/scoring-engine.types";

export type ICanonicalGenreScorerPort = {
	get id(): CanonicalGenreId;
	score(input: ScoringInput): number;
};
