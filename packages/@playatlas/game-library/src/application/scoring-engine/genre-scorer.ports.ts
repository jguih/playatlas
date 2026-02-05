import type { GenreId } from "@playatlas/common/domain";
import type { Game } from "../../domain/game.entity";
import type { Genre } from "../../domain/genre.entity";
import type { CanonicalGenreId, Evidence, ScoreResult, ScoringInput } from "./genre-scorer.types";

export type ICanonicalGenreScorerPort<TGroup extends string> = {
	get id(): CanonicalGenreId;
	score(input: ScoringInput): ScoreResult<TGroup>;
};

export interface IGenreScoringPolicyPort<TGroup extends string> {
	apply(evidence: Evidence<TGroup>[]): ScoreResult<TGroup>;
}

export interface IEvidenceExtractorPort<TGroup extends string> {
	extract(
		game: Game,
		options: { readonly genres: ReadonlyMap<GenreId, Genre> },
	): Evidence<TGroup>[];
}
