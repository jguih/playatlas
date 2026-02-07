import { ClassificationIdParser } from "@playatlas/common/domain";
import type { IScoreEnginePort } from "../score-engine.port";
import type { IHorrorEvidenceExtractorPort } from "./horror.evidence-extractor";
import type { IHorrorScoringPolicyPort } from "./horror.policy";
import type { HorrorEvidenceGroup } from "./horror.types";

export type IHorrorScoreEnginePort = IScoreEnginePort<HorrorEvidenceGroup>;

export type HorrorScoreEngineDeps = {
	horrorEvidenceExtractor: IHorrorEvidenceExtractorPort;
	horrorScoringPolicy: IHorrorScoringPolicyPort;
};

export const makeHorrorScoreEngine = ({
	horrorEvidenceExtractor,
	horrorScoringPolicy,
}: HorrorScoreEngineDeps): IHorrorScoreEnginePort => {
	return {
		id: ClassificationIdParser.fromTrusted("HORROR"),
		score: ({ game, genresSnapshot }) => {
			const evidence = horrorEvidenceExtractor.extract(game, { genres: genresSnapshot });
			const result = horrorScoringPolicy.apply(evidence);
			return result;
		},
	};
};
