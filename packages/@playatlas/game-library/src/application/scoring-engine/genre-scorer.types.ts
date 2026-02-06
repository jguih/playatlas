import type { GenreId } from "@playatlas/common/domain";
import type { Game } from "../../domain/game.entity";
import type { Genre } from "../../domain/genre.entity";

export type EvidenceSource =
	| "taxonomy" // genres, tags, categories
	| "text" // descriptions, summaries
	| "mechanics" // gameplay features
	| "synergy";

export type EvidenceTier = "A" | "B" | "C";

export type Evidence<TGroup> = {
	source: EvidenceSource;
	sourceHint?: string;
	match: string | number;
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	// Whether the signal is identity defining or not
	isGate: boolean;
};

export type StoredEvidence<TGroup> = Evidence<TGroup> & {
	status: "used" | "ignored";
	contribution: number;
};

export type Penalty = {
	type: "no_gate" | "multiple_gates";
	contribution: number;
	details: string;
};

export type ScoreBreakdown<TGroup> = {
	mode: "with_gate" | "without_gate";
	groups: {
		group: TGroup;
		evidences: StoredEvidence<TGroup>[];
		contribution: number;
	}[];
	synergy: {
		contribution: number;
		details: string;
	};
	subtotal: number;
	penalties: Array<Penalty>;
	total: number;
};

export type ScoreResult<TGroup> = {
	score: number;
	breakdown: ScoreBreakdown<TGroup>;
};

export type CanonicalGenreId = "HORROR" | "SIMULATION";

export type ScoringInput = {
	game: Game;
	readonly genresSnapshot: ReadonlyMap<GenreId, Genre>;
};
