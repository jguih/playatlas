import type {
	Company,
	CompletionStatus,
	Genre,
	Platform,
	Tag,
} from "@playatlas/game-library/domain";
import type { ITestHorrorScoreEnginePort } from "@playatlas/game-library/testing";

export type GameRelationshipOptions = {
	completionStatusList: CompletionStatus[];
	companyList: Company[];
	genreList: Genre[];
	platformList: Platform[];
	tagList: Tag[];
};

export type TestDoubleServices = {
	gameLibrary: {
		scoreEngine: {
			horror: ITestHorrorScoreEnginePort;
		};
	};
};
