import { faker } from "@faker-js/faker";
import { GenreIdParser } from "@playatlas/common/domain";
import type { TestEntityFactory } from "@playatlas/common/testing";
import { type Genre, makeGenre } from "../domain/genre.entity";
import type { MakeGenreProps } from "../domain/genre.entity.types";

export type GenreFactory = TestEntityFactory<MakeGenreProps, Genre>;

export const makeGenreFactory = (): GenreFactory => {
	const build: GenreFactory["build"] = (props = {}) => {
		return makeGenre({
			id: GenreIdParser.fromExternal(props.id ?? faker.string.uuid()),
			name: props.name ?? faker.lorem.words({ min: 1, max: 2 }),
			lastUpdatedAt: props.lastUpdatedAt ?? faker.date.recent(),
		});
	};

	const buildList: GenreFactory["buildList"] = (n, props = {}) => {
		return Array.from({ length: n }, () => build(props));
	};

	return { build, buildList };
};
