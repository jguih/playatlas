import type {
	Company,
	CompletionStatus,
	Game,
	Genre,
	Platform,
	Tag,
} from "@playatlas/game-library/domain";
import type { GameRelationshipOptions } from "../test.api.types";

export type ISeedDataModulePort = {
	seedCompany: (company: Company | Company[]) => void;
	seedGame: (game: Game | Game[]) => void;
	seedGenre: (genre: Genre | Genre[]) => void;
	seedPlatform: (platform: Platform | Platform[]) => void;
	seedCompletionStatus: (completionStatus: CompletionStatus | CompletionStatus[]) => void;
	seedTags: (tag: Tag | Tag[]) => void;
	seedGameRelationships: (gameRelationshipOptions: GameRelationshipOptions) => void;
	seedDefaultClassifications: () => void;
};
