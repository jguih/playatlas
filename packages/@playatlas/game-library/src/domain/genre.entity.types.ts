import type { GenreId, PlayniteGenreId } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import type { GenreName } from "./genre.entity";

export type PlayniteGenreSnapshot = {
	id: PlayniteGenreId | null;
};

type SyncProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type SoftDeleteProps = {
	deletedAt: Date | null;
	deleteAfter: Date | null;
};

type BaseProps = {
	id: GenreId;
	name: GenreName;
};

type PlayniteProps = {
	playniteSnapshot: PlayniteGenreSnapshot | null;
};

export type MakeGenreProps = Partial<SyncProps> &
	BaseProps &
	Partial<SoftDeleteProps> &
	Partial<PlayniteProps>;

export type RehydrateGenreProps = SyncProps & BaseProps & SoftDeleteProps & PlayniteProps;

export type MakeGenreDeps = {
	clock: IClockPort;
};

export type UpdateGenreFromPlayniteProps = {
	playniteSnapshot: PlayniteGenreSnapshot;
	name: GenreName;
};
