import { faker } from "@faker-js/faker";
import { GenreIdParser, PlayniteGenreIdParser } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import type { TestEntityFactory } from "@playatlas/common/testing";
import { monotonicFactory } from "ulid";
import type { IGenreFactoryPort } from "../application";
import { type Genre } from "../domain/genre.entity";
import type { MakeGenreProps } from "../domain/genre.entity.types";
import { makeBaseTestFactory } from "./base.factory";

export type GenreFactory = TestEntityFactory<MakeGenreProps, Genre>;

export type GenreFactoryDeps = {
	genreFactory: IGenreFactoryPort;
	clock: IClockPort;
};

export const makeGenreFactory = ({ genreFactory }: GenreFactoryDeps): GenreFactory => {
	const { p } = makeBaseTestFactory();

	const createBuilder = (ulid = monotonicFactory()) => ({
		build: (props: Partial<MakeGenreProps> = {}) => {
			return genreFactory.create({
				id: p(GenreIdParser.fromTrusted(ulid()), props.id),
				playniteSnapshot: {
					id: p(PlayniteGenreIdParser.fromTrusted(faker.string.uuid()), props.playniteSnapshot?.id),
				},
				name: props.name ?? faker.lorem.words({ min: 1, max: 2 }),
				lastUpdatedAt: p(undefined, props.lastUpdatedAt),
				createdAt: p(undefined, props.createdAt),
				deletedAt: p(undefined, props.deletedAt),
				deleteAfter: p(undefined, props.deleteAfter),
			});
		},
	});

	const build: GenreFactory["build"] = (props = {}) => {
		const builder = createBuilder();
		return builder.build(props);
	};

	const buildList: GenreFactory["buildList"] = (n, props = {}) => {
		const builder = createBuilder();
		return Array.from({ length: n }, () => builder.build(props));
	};

	return { build, buildList };
};
