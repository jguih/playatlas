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
	"PlayniteHidden",
	"PlayniteCompletionStatusId",
	"PlayniteBackgroundImagePath",
	"PlayniteCoverImagePath",
	"PlayniteIconImagePath",
	"CompletionStatusId",
	"ContentHash",
	"LastUpdatedAt",
	"CreatedAt",
	"DeletedAt",
	"DeleteAfter",
];

export const RELATIONSHIP_TABLE_NAME = {
	gameDeveloper: "game_developer",
	gamePublisher: "game_publisher",
	gameGenre: "game_genre",
	gamePlatform: "game_platform",
	gameTag: "game_tag",
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
	tags: {
		table: RELATIONSHIP_TABLE_NAME.gameTag,
		column: "TagId" as const,
	},
} satisfies Record<GameRelationship, { table: string; column: string }>;
