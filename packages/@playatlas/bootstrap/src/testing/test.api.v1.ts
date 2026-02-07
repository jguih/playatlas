import type { IClockPort } from "@playatlas/common/infra";
import type { IApplyDefaultClassificationsCommandHandlerPort } from "@playatlas/game-library/commands";
import type { GameClassification } from "@playatlas/game-library/domain";

export type PlayAtlasTestApiV1 = {
	clock: IClockPort;
	gameLibrary: {
		commands: {
			getApplyDefaultClassificationsCommandHandler: () => IApplyDefaultClassificationsCommandHandlerPort;
		};
		seed: {
			gameClassification: (entity: GameClassification | GameClassification[]) => void;
		};
	};
};
