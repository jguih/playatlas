import { makeScoreEngine } from "../score-engine";
import type { IScoreEnginePort } from "../score-engine.port";
import type { IHorrorEvidenceExtractorPort } from "./horror.evidence-extractor";
import type { IHorrorScoringPolicyPort } from "./horror.policy";
import {
	HORROR_ENGINE_EVIDENCE_GROUPS_META,
	HORROR_ENGINE_VERSION,
	type HorrorEvidenceGroup,
} from "./horror.score-engine.meta";

export type IHorrorScoreEnginePort = IScoreEnginePort<HorrorEvidenceGroup>;

export type HorrorScoreEngineDeps = {
	horrorEvidenceExtractor: IHorrorEvidenceExtractorPort;
	horrorScoringPolicy: IHorrorScoringPolicyPort;
};

export const makeHorrorScoreEngine = ({
	horrorEvidenceExtractor,
	horrorScoringPolicy,
}: HorrorScoreEngineDeps): IHorrorScoreEnginePort => {
	const self = makeScoreEngine({
		id: "HORROR",
		version: HORROR_ENGINE_VERSION,
		evidenceGroupMeta: HORROR_ENGINE_EVIDENCE_GROUPS_META,
	});

	return {
		...self,
		score: ({ game, genresSnapshot, tagsSnapshot }) => {
			const evidence = horrorEvidenceExtractor.extract(game, {
				genres: genresSnapshot,
				tags: tagsSnapshot,
			});
			const result = horrorScoringPolicy.apply(evidence);
			return result;
		},
	};
};
