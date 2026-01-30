import type { Relationship } from "@playatlas/common/common";
import type {
	CompanyId,
	CompletionStatusId,
	GameId,
	GenreId,
	PlatformId,
	PlayniteGameId,
} from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";

export type GameRelationshipMap = {
	developers: CompanyId;
	publishers: CompanyId;
	genres: GenreId;
	platforms: PlatformId;
};

export type GameRelationship = keyof GameRelationshipMap;

export type GameRelationshipProps = {
	[K in GameRelationship]: Relationship<GameRelationshipMap[K]>;
};

export type MakeGameRelationshipProps = {
	developerIds?: CompanyId[] | null;
	publisherIds?: CompanyId[] | null;
	genreIds?: GenreId[] | null;
	platformIds?: PlatformId[] | null;
};

export type PlayniteGameSnapshot = {
	id: PlayniteGameId;
	name: string | null;
	description: string | null;
	releaseDate: Date | null;
	playtime: number;
	lastActivity: Date | null;
	added: Date | null;
	installDirectory: string | null;
	isInstalled: boolean;
	hidden: boolean;
	completionStatusId: CompletionStatusId | null;
	backgroundImagePath: string | null;
	coverImagePath: string | null;
	iconImagePath: string | null;
};

type BaseGame = {
	id: GameId;
	contentHash: string;
	completionStatusId?: CompletionStatusId | null;
};

type PlayniteProps = {
	playniteSnapshot: PlayniteGameSnapshot | null;
};

type SoftDeleteProps = {
	deletedAt: Date | null;
	deleteAfter: Date | null;
};

type SyncGameProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

export type MakeGameProps = Partial<SyncGameProps> &
	BaseGame &
	MakeGameRelationshipProps &
	Partial<SoftDeleteProps> &
	Partial<PlayniteProps>;

export type RehydrateGameProps = SyncGameProps &
	BaseGame &
	MakeGameRelationshipProps &
	SoftDeleteProps &
	PlayniteProps;

export type MakeGameDeps = {
	clock: IClockPort;
};

export type UpdateGameFromPlayniteProps = {
	relationships: {
		developerIds: CompanyId[];
		publisherIds: CompanyId[];
		genreIds: GenreId[];
		platformIds: PlatformId[];
	};
	contentHash: string;
	playniteSnapshot: PlayniteGameSnapshot;
};
