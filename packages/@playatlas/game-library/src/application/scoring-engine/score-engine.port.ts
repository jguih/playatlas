import type { ClassificationId, GenreId } from "@playatlas/common/domain";
import type { Game, Genre } from "../../domain";
import type { ScoreBreakdown } from "./score-breakdown";

export type ScoreEngineVersion = string;

export type ScoreResult<TGroup> = {
	score: number;
	breakdown: ScoreBreakdown<TGroup>;
};

export type ScoringInput = {
	game: Game;
	readonly genresSnapshot: ReadonlyMap<GenreId, Genre>;
};

export type IScoreEnginePort<TGroup extends string> = {
	get id(): ClassificationId;
	get version(): ScoreEngineVersion;
	score(input: ScoringInput): ScoreResult<TGroup>;
	serializeBreakdown: (breakdown: ScoreBreakdown<TGroup>) => string;
	deserializeBreakdown: (json: string) => ScoreBreakdown<TGroup>;
};

export type ScoreEngineBaseDeps = {
	engineVersion?: ScoreEngineVersion;
};
