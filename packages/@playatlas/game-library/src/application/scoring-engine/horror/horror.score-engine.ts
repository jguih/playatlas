import type { ClassificationId } from "@playatlas/common/domain";
import { ScoreEngineSerializationError } from "../../../domain";
import { scoreBreakdownSchema, type ScoreBreakdown } from "../score-breakdown";
import type { IScoreEnginePort } from "../score-engine.port";
import type { IHorrorEvidenceExtractorPort } from "./horror.evidence-extractor";
import type { IHorrorScoringPolicyPort } from "./horror.policy";
import { HORROR_ENGINE_VERSION, type HorrorEvidenceGroup } from "./horror.score-engine.meta";

export type IHorrorScoreEnginePort = IScoreEnginePort<HorrorEvidenceGroup>;

export type HorrorScoreEngineDeps = {
	horrorEvidenceExtractor: IHorrorEvidenceExtractorPort;
	horrorScoringPolicy: IHorrorScoringPolicyPort;
};

export const makeHorrorScoreEngine = ({
	horrorEvidenceExtractor,
	horrorScoringPolicy,
}: HorrorScoreEngineDeps): IHorrorScoreEnginePort => {
	const classificationId: ClassificationId = "HORROR";

	return {
		id: classificationId,
		version: HORROR_ENGINE_VERSION,
		score: ({ game, genresSnapshot }) => {
			const evidence = horrorEvidenceExtractor.extract(game, { genres: genresSnapshot });
			const result = horrorScoringPolicy.apply(evidence);
			return result;
		},
		deserializeBreakdown: (json) => {
			const { success, data: breakdown, error } = scoreBreakdownSchema.safeParse(JSON.parse(json));
			if (!success)
				throw new ScoreEngineSerializationError(
					"Failed to deserialize score engine breakdown JSON string",
					{ engineVersion: HORROR_ENGINE_VERSION, classificationId },
					error,
				);
			return breakdown as unknown as ScoreBreakdown<HorrorEvidenceGroup>;
		},
		serializeBreakdown: (breakdown) => {
			return JSON.stringify(breakdown, null, 2);
		},
	};
};
