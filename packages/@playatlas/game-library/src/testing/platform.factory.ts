import { faker } from "@faker-js/faker";
import { PlatformIdParser, PlaynitePlatformIdParser } from "@playatlas/common/domain";
import type { TestEntityFactory } from "@playatlas/common/testing";
import { monotonicFactory } from "ulid";
import type { IPlatformFactoryPort } from "../application";
import { type Platform } from "../domain/platform.entity";
import type { MakePlatformProps } from "../domain/platform.entity.types";
import { makeBaseTestFactory } from "./base.factory";

export type PlatformFactory = TestEntityFactory<MakePlatformProps, Platform>;

export type PlatformFactoryDeps = {
	platformFactory: IPlatformFactoryPort;
};

export const makePlatformFactory = ({ platformFactory }: PlatformFactoryDeps): PlatformFactory => {
	const { p } = makeBaseTestFactory();

	const createBuilder = (ulid = monotonicFactory()) => ({
		build: (props: Partial<MakePlatformProps> = {}) => {
			return platformFactory.create({
				id: p(PlatformIdParser.fromTrusted(ulid()), props.id),
				name: p(faker.lorem.words({ min: 1, max: 3 }), props.name),
				playniteSnapshot: {
					id: p(
						PlaynitePlatformIdParser.fromTrusted(faker.string.uuid()),
						props.playniteSnapshot?.id,
					),
					specificationId: p(faker.string.uuid(), props.playniteSnapshot?.specificationId),
				},
			});
		},
	});

	const build: PlatformFactory["build"] = (props = {}) => {
		const builder = createBuilder();
		return builder.build(props);
	};

	const buildList: PlatformFactory["buildList"] = (n, props = {}) => {
		return Array.from({ length: n }, () => build(props));
	};

	return { build, buildList };
};
