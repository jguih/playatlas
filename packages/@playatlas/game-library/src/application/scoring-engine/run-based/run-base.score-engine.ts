import { makeScoreEngine } from "../score-engine";
import type { IScoreEnginePort } from "../score-engine.port";
import type { IRunBasedEvidenceExtractorPort } from "./run-based.evidence-extractor";
import type { IRunBasedScoringPolicyPort } from "./run-based.policy";
import {
	RUN_BASED_ENGINE_VERSION,
	type RunBasedEvidenceGroup,
} from "./run-based.score-engine.meta";

export type IRunBasedScoreEngine = IScoreEnginePort<RunBasedEvidenceGroup>;

export type RunBasedScoreEngineDeps = {
	runBasedEvidenceExtractor: IRunBasedEvidenceExtractorPort;
	runBasedScoringPolicy: IRunBasedScoringPolicyPort;
};

export const makeRunBasedScoreEngine = ({
	runBasedEvidenceExtractor,
	runBasedScoringPolicy,
}: RunBasedScoreEngineDeps): IRunBasedScoreEngine => {
	const self = makeScoreEngine<RunBasedEvidenceGroup>({
		id: "RUN-BASED",
		version: RUN_BASED_ENGINE_VERSION,
	});

	return {
		...self,
		score: ({ game, genresSnapshot, tagsSnapshot }) => {
			const evidence = runBasedEvidenceExtractor.extract(game, {
				genres: genresSnapshot,
				tags: tagsSnapshot,
			});
			const result = runBasedScoringPolicy.apply(evidence);
			return result;
		},
	};
};
