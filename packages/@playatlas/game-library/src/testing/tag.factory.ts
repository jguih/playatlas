import { faker } from "@faker-js/faker";
import { PlayniteTagIdParser, TagIdParser } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import type { TestEntityFactory } from "@playatlas/common/testing";
import { monotonicFactory } from "ulid";
import type { ITagFactoryPort } from "../application";
import type { MakeTagProps, Tag } from "../domain";
import { makeBaseTestFactory } from "./base.factory";

export type TestTagFactory = TestEntityFactory<MakeTagProps, Tag>;

export type TestTagFactoryDeps = {
	tagFactory: ITagFactoryPort;
	clock: IClockPort;
};

export const makeTestTagFactory = ({ tagFactory }: TestTagFactoryDeps): TestTagFactory => {
	const { p } = makeBaseTestFactory();

	const createBuilder = (ulid = monotonicFactory()) => ({
		build: (props: Partial<MakeTagProps> = {}) => {
			return tagFactory.create({
				id: p(TagIdParser.fromTrusted(ulid()), props.id),
				playniteSnapshot: {
					id: p(PlayniteTagIdParser.fromTrusted(faker.string.uuid()), props.playniteSnapshot?.id),
				},
				name: props.name ?? faker.lorem.words({ min: 1, max: 2 }),
				lastUpdatedAt: p(undefined, props.lastUpdatedAt),
				createdAt: p(undefined, props.createdAt),
				deletedAt: p(undefined, props.deletedAt),
				deleteAfter: p(undefined, props.deleteAfter),
			});
		},
	});

	const build: TestTagFactory["build"] = (props = {}) => {
		const builder = createBuilder();
		return builder.build(props);
	};

	const buildList: TestTagFactory["buildList"] = (n, props = {}) => {
		const builder = createBuilder();
		return Array.from({ length: n }, () => builder.build(props));
	};

	return { build, buildList };
};
