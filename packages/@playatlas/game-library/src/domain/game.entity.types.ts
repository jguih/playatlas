import type {
	CompanyId,
	GameId,
	GenreId,
	PlatformId,
	PlayniteGameId,
} from "@playatlas/common/domain";

export type MakeGameRelationshipProps = {
	developerIds?: CompanyId[] | null;
	publisherIds?: CompanyId[] | null;
	genreIds?: GenreId[] | null;
	platformIds?: PlatformId[] | null;
};

export type PlayniteGameSnapshot = Readonly<{
	id: PlayniteGameId;
	name: string | null;
	description: string | null;
	releaseDate: Date | null;
	playtime: number;
	lastActivity: Date | null;
	added: Date | null;
	installDirectory: string | null;
	isInstalled: boolean;
	backgroundImage: string | null;
	coverImage: string | null;
	icon: string | null;
	hidden: boolean;
	completionStatusId: string | null;
}>;

export type MakeGameProps = {
	id: GameId;
	contentHash: string;
	lastUpdatedAt: Date;
	playniteSnapshot: PlayniteGameSnapshot;
	backgroundImagePath?: string | null;
	coverImagePath?: string | null;
	iconImagePath?: string | null;
	deletedAt?: Date | null;
	deleteAfter?: Date | null;
	createdAt?: Date | null;
} & MakeGameRelationshipProps;
