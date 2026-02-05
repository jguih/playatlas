import type { ICanonicalGenreScorerPort } from "../genre-scorer.ports";
import type { IHorrorEvidenceExtractorPort } from "./horror-evidence-extractor";
import type { IHorrorScoringPolicyPort } from "./horror-scoring-policy";
import type { HorrorEvidenceGroup } from "./horror.types";

export type IHorrorScorerPort = ICanonicalGenreScorerPort<HorrorEvidenceGroup>;

export type HorrorScorerDeps = {
	horrorEvidenceExtractor: IHorrorEvidenceExtractorPort;
	horrorScoringPolicy: IHorrorScoringPolicyPort;
};

export const makeHorrorScorer = ({
	horrorEvidenceExtractor,
	horrorScoringPolicy,
}: HorrorScorerDeps): IHorrorScorerPort => {
	return {
		id: "HORROR",
		score: ({ game, genresSnapshot }) => {
			const evidence = horrorEvidenceExtractor.extract(game, { genres: genresSnapshot });
			const result = horrorScoringPolicy.apply(evidence);
			return result;
		},
	};
};
