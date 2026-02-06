import type { IClockPort } from "@playatlas/common/infra";
import type { IApplyDefaultClassificationsCommandHandlerPort } from "@playatlas/game-library/commands";

export type PlayAtlasTestApiV1 = {
	clock: IClockPort;
	gameLibrary: {
		commands: {
			getApplyDefaultClassificationsCommandHandler: () => IApplyDefaultClassificationsCommandHandlerPort;
		};
	};
};
