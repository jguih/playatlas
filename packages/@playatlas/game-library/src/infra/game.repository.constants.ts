import type { GameRelationship } from "../domain/game.entity.types";
import type { GameModel } from "./game.repository";

export const TABLE_NAME = "game" as const;

export const COLUMNS: (keyof GameModel)[] = [
	"Id",
	"PlayniteId",
	"PlayniteName",
	"PlayniteDescription",
	"PlayniteReleaseDate",
	"PlaynitePlaytime",
	"PlayniteLastActivity",
	"PlayniteAdded",
	"PlayniteInstallDirectory",
	"PlayniteIsInstalled",
	"PlayniteBackgroundImage",
	"PlayniteCoverImage",
	"PlayniteIcon",
	"PlayniteHidden",
	"PlayniteCompletionStatusId",
	"CompletionStatusId",
	"ContentHash",
	"LastUpdatedAt",
	"CreatedAt",
	"DeletedAt",
	"DeleteAfter",
	"BackgroundImagePath",
	"CoverImagePath",
	"IconImagePath",
];

export const RELATIONSHIP_TABLE_NAME = {
	gameDeveloper: "game_developer",
	gamePublisher: "game_publisher",
	gameGenre: "playnite_game_genre",
	gamePlatform: "playnite_game_platform",
} as const;

export const GAME_RELATIONSHIP_META = {
	developers: {
		table: RELATIONSHIP_TABLE_NAME.gameDeveloper,
		column: "DeveloperId" as const,
	},
	publishers: {
		table: RELATIONSHIP_TABLE_NAME.gamePublisher,
		column: "PublisherId" as const,
	},
	genres: {
		table: RELATIONSHIP_TABLE_NAME.gameGenre,
		column: "GenreId" as const,
	},
	platforms: {
		table: RELATIONSHIP_TABLE_NAME.gamePlatform,
		column: "PlatformId" as const,
	},
} satisfies Record<GameRelationship, { table: string; column: string }>;
