import type { GenreId } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";

type CommonProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type BaseProps = {
	id: GenreId;
	name: string;
	deletedAt?: Date;
	deleteAfter?: Date;
};

export type MakeGenreProps = Partial<CommonProps> & BaseProps;

export type RehydrateGenreProps = CommonProps & BaseProps;

export type MakeGenreDeps = {
	clock: IClockPort;
};
