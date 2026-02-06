import { ClassificationIdParser } from "../../../domain/value-object/classification-id";
import type { IClassificationScorerPort } from "../scorer.ports";
import type { IHorrorEvidenceExtractorPort } from "./horror.evidence-extractor";
import type { IHorrorScoringPolicyPort } from "./horror.policy";
import type { HorrorEvidenceGroup } from "./horror.types";

export type IHorrorScorerPort = IClassificationScorerPort<HorrorEvidenceGroup>;

export type HorrorScorerDeps = {
	horrorEvidenceExtractor: IHorrorEvidenceExtractorPort;
	horrorScoringPolicy: IHorrorScoringPolicyPort;
};

export const makeHorrorScorer = ({
	horrorEvidenceExtractor,
	horrorScoringPolicy,
}: HorrorScorerDeps): IHorrorScorerPort => {
	return {
		id: ClassificationIdParser.fromTrusted("HORROR"),
		score: ({ game, genresSnapshot }) => {
			const evidence = horrorEvidenceExtractor.extract(game, { genres: genresSnapshot });
			const result = horrorScoringPolicy.apply(evidence);
			return result;
		},
	};
};
