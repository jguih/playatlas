import type { GenreId } from "@playatlas/common/domain";
import type { Game } from "../../domain/game.entity";
import type { Genre } from "../../domain/genre.entity";

export type EvidenceSource =
	| "taxonomy" // genres, tags, categories
	| "text" // descriptions, summaries
	| "mechanics" // gameplay features
	| "synergy";

export type EvidenceTier = "A" | "B" | "C";

export type Evidence<TGroup extends string> = {
	source: EvidenceSource;
	sourceHint?: string;
	match: string | number;
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	// Whether the signal is identity defining or not
	isGate: boolean;
};

export type GroupPolicy = {
	cap?: number;
	multiplier?: number;
};

export type GenreGroupPolicy<TGroup extends string> = Record<TGroup, GroupPolicy>;

export type ScoreResult<TGroup extends string> = {
	score: number;
	evidence: Evidence<TGroup>[];
};

export type CanonicalGenreId = "HORROR" | "SIMULATION";

export type ScoringInput = {
	game: Game;
	readonly genresSnapshot: ReadonlyMap<GenreId, Genre>;
};
