import type { IApplyDefaultClassificationsCommandHandlerPort } from "@playatlas/game-library/commands";
import type { ITestHorrorScoreEnginePort } from "@playatlas/game-library/testing";
import type { TestClock } from "./test-clock";

export type TestApiStubs = {
	scoreEngine: {
		horrorScoreEngine: ITestHorrorScoreEnginePort;
	};
};

export type PlayAtlasTestApiV1 = {
	getClock: () => TestClock;
	gameLibrary: {
		commands: {
			getApplyDefaultClassificationsCommandHandler: () => IApplyDefaultClassificationsCommandHandlerPort;
		};
	};
	getStubs: () => TestApiStubs;
};
