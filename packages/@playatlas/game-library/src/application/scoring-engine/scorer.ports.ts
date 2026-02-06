import type { ClassificationId, GenreId } from "@playatlas/common/domain";
import type { Game } from "../../domain/game.entity";
import type { Genre } from "../../domain/genre.entity";
import type { Evidence, ScoreResult, ScoringInput } from "./scorer.types";

export type IClassificationScorerPort<TGroup extends string> = {
	get id(): ClassificationId;
	score(input: ScoringInput): ScoreResult<TGroup>;
};

export interface IClassificationScoringPolicyPort<TGroup extends string> {
	apply(evidence: Evidence<TGroup>[]): ScoreResult<TGroup>;
}

export interface IEvidenceExtractorPort<TGroup extends string> {
	extract(
		game: Game,
		options: { readonly genres: ReadonlyMap<GenreId, Genre> },
	): Evidence<TGroup>[];
}
