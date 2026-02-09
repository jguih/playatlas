import type { EngineScoreMode, GenreId } from "@playatlas/common/domain";
import type { Game } from "../../domain/game.entity";
import type { Genre } from "../../domain/genre.entity";
import type { ScoreBreakdown } from "./score-breakdown";

export type ScoreEngineVersion = string;

export type ScoreResult<TGroup> = {
	score: number;
	normalizedScore: number;
	mode: EngineScoreMode;
	breakdown: ScoreBreakdown<TGroup>;
};

export type ScoringInput = {
	game: Game;
	readonly genresSnapshot: ReadonlyMap<GenreId, Genre>;
};
