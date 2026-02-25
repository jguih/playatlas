import type {
	IRunBasedEvidenceExtractorPort,
	IScoreBreakdownNormalizerPort,
} from "@playatlas/game-library/application";
import type { IApplyDefaultClassificationsCommandHandlerPort } from "@playatlas/game-library/commands";
import type { ITestHorrorScoreEnginePort } from "@playatlas/game-library/testing";
import type { TestClock } from "./test-clock";

export type PlayAtlasTestApiV1 = {
	getClock: () => TestClock;
	gameLibrary: {
		commands: {
			getApplyDefaultClassificationsCommandHandler: () => IApplyDefaultClassificationsCommandHandlerPort;
		};
		scoreEngine: {
			getScoreBreakdownNormalizer: () => IScoreBreakdownNormalizerPort;
			getHorrorScoreEngine: () => ITestHorrorScoreEnginePort;

			evidenceExtractors: {
				getRunBasedEvidenceExtractor: () => IRunBasedEvidenceExtractorPort;
			};
		};
	};
};
