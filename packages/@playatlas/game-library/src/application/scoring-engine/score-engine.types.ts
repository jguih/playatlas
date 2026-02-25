import type { EngineScoreMode, EvidenceGroupRole, GenreId, TagId } from "@playatlas/common/domain";
import type { Game } from "../../domain/game.entity";
import type { Genre } from "../../domain/genre.entity";
import type { Tag } from "../../domain/tag.entity";
import type { ScoreBreakdown } from "./score-breakdown";

export type ScoreEngineVersion = string;

type EvidenceGroupMeta = {
	userFacing: boolean;
	role: EvidenceGroupRole;
};

export type ScoreEngineEvidenceGroupsMeta<TGroup extends string> = Record<
	TGroup,
	EvidenceGroupMeta
>;

export type ScoreResult<TGroup extends string> = {
	score: number;
	normalizedScore: number;
	mode: EngineScoreMode;
	breakdown: ScoreBreakdown<TGroup>;
};

export type ScoringInput = {
	game: Game;
	readonly genresSnapshot: ReadonlyMap<GenreId, Genre>;
	readonly tagsSnapshot: ReadonlyMap<TagId, Tag>;
};
