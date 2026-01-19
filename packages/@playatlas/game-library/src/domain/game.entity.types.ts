import type { Relationship } from "@playatlas/common/common";
import type {
	CompanyId,
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

type BaseGame = {
	id: GameId;
	contentHash: string;
	playniteSnapshot: PlayniteGameSnapshot;
	backgroundImagePath?: string | null;
	coverImagePath?: string | null;
	iconImagePath?: string | null;
	deletedAt?: Date | null;
	deleteAfter?: Date | null;
};

type CommonGameProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

export type MakeGameProps = Partial<CommonGameProps> & BaseGame & MakeGameRelationshipProps;

export type RehydrateGameProps = CommonGameProps & BaseGame & MakeGameRelationshipProps;

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
