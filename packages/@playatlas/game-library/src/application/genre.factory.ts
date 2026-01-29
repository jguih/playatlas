import type { IEntityFactoryPort } from "@playatlas/common/application";
import { GenreIdParser } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import { monotonicFactory } from "ulid";
import { makeGenre, rehydrateGenre, type Genre } from "../domain/genre.entity";
import type { MakeGenreProps, RehydrateGenreProps } from "../domain/genre.entity.types";

type MakeGenrePropsWithOptionalId = Omit<MakeGenreProps, "id"> & {
	id?: MakeGenreProps["id"];
};

export type IGenreFactoryPort = IEntityFactoryPort<
	MakeGenrePropsWithOptionalId,
	RehydrateGenreProps,
	Genre
>;

export type GenreFactoryDeps = {
	clock: IClockPort;
};

export const makeGenreFactory = (deps: GenreFactoryDeps): IGenreFactoryPort => {
	const ulid = monotonicFactory();

	return {
		create: (props) =>
			makeGenre({ ...props, id: props.id ?? GenreIdParser.fromTrusted(ulid()) }, deps),
		rehydrate: (props) => rehydrateGenre(props, deps),
	};
};
