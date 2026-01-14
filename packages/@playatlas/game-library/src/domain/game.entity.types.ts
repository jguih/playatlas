import type { GameId } from "@playatlas/common/domain";
import type { CompanyId } from "./company.entity";
import type { GenreId } from "./genre.entity";
import type { PlatformId } from "./platform.entity";

export type MakeGameRelationshipProps = {
	developerIds?: CompanyId[] | null;
	publisherIds?: CompanyId[] | null;
	genreIds?: GenreId[] | null;
	platformIds?: PlatformId[] | null;
};

export type MakeGameProps = {
	id: GameId;
	name?: string | null;
	description?: string | null;
	releaseDate?: Date | null;
	playtime?: number;
	lastActivity?: Date | null;
	added?: Date | null;
	installDirectory?: string | null;
	isInstalled?: boolean;
	backgroundImage?: string | null;
	coverImage?: string | null;
	icon?: string | null;
	hidden?: boolean;
	completionStatusId?: string | null;
	contentHash: string;
} & MakeGameRelationshipProps;
