import type { GenreId } from "@playatlas/common/domain";
import type { Game } from "../../domain/game.entity";
import type { Genre } from "../../domain/genre.entity";
import type { EvidenceGroup } from "./evidence.types";
import type { ScoreBreakdown } from "./score-breakdown";

export type ScoreEngineVersion = string;

export type ScoreResult<TGroup extends EvidenceGroup> = {
	score: number;
	breakdown: ScoreBreakdown<TGroup>;
};

export type ScoringInput = {
	game: Game;
	readonly genresSnapshot: ReadonlyMap<GenreId, Genre>;
};
