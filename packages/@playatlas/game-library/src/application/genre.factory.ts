import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import { makeGenre, rehydrateGenre, type Genre } from "../domain/genre.entity";
import type { MakeGenreProps, RehydrateGenreProps } from "../domain/genre.entity.types";

export type IGenreFactoryPort = IEntityFactoryPort<MakeGenreProps, RehydrateGenreProps, Genre>;

export type GenreFactoryDeps = {
	clock: IClockPort;
};

export const makeGenreFactory = (deps: GenreFactoryDeps): IGenreFactoryPort => {
	return {
		create: (props) => makeGenre(props, deps),
		rehydrate: (props) => rehydrateGenre(props, deps),
	};
};
