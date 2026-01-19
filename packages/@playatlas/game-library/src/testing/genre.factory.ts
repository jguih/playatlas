import { faker } from "@faker-js/faker";
import { GenreIdParser } from "@playatlas/common/domain";
import type { TestEntityFactory } from "@playatlas/common/testing";
import type { IGenreFactoryPort } from "../application";
import { type Genre } from "../domain/genre.entity";
import type { MakeGenreProps } from "../domain/genre.entity.types";

export type GenreFactory = TestEntityFactory<MakeGenreProps, Genre>;

export type GenreFactoryDeps = {
	genreFactory: IGenreFactoryPort;
};

export const makeGenreFactory = ({ genreFactory }: GenreFactoryDeps): GenreFactory => {
	const build: GenreFactory["build"] = (props = {}) => {
		const recent = faker.date.recent();

		return genreFactory.create({
			id: GenreIdParser.fromExternal(props.id ?? faker.string.uuid()),
			name: props.name ?? faker.lorem.words({ min: 1, max: 2 }),
			lastUpdatedAt: props.lastUpdatedAt ?? recent,
			createdAt: props.createdAt ?? recent,
		});
	};

	const buildList: GenreFactory["buildList"] = (n, props = {}) => {
		return Array.from({ length: n }, () => build(props));
	};

	return { build, buildList };
};
