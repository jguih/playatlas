import type { PlayniteGenreId } from "@playatlas/common/domain";

export type CanonicalGenreId = "HORROR" | "SIMULATION";

export type ScoringInput = {
	genres: PlayniteGenreId[];
	tags: string[];
};
