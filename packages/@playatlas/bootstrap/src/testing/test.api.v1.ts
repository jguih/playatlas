import type { IApplyDefaultClassificationsCommandHandlerPort } from "@playatlas/game-library/commands";
import type { TestClock } from "./test-clock";

export type PlayAtlasTestApiV1 = {
	getClock: () => TestClock;
	gameLibrary: {
		commands: {
			getApplyDefaultClassificationsCommandHandler: () => IApplyDefaultClassificationsCommandHandlerPort;
		};
	};
};
