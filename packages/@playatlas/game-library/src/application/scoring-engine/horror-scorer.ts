import { normalize } from "@playatlas/common/common";
import type { ICanonicalGenreScorerPort } from "./genre-scorer.port";

export const makeHorrorScorer = (): ICanonicalGenreScorerPort => {
	return {
		id: "HORROR",
		score: (input) => {
			let score = 0;

			const genres = input.genres.map(normalize);
			const tags = input.tags.map(normalize);

			if (genres.includes("horror") || genres.includes("terror")) score += 50;
			if (genres.includes("survival horror") || genres.includes("terror psicológico")) score += 60;

			if (tags.includes("atmospheric")) score += 10;
			if (tags.includes("dark")) score += 5;

			return Math.min(score, 100);
		},
	};
};
