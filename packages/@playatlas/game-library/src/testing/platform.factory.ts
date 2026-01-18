import { faker } from "@faker-js/faker";
import { PlatformIdParser } from "@playatlas/common/domain";
import type { TestEntityFactory } from "@playatlas/common/testing";
import type { IPlatformFactoryPort } from "../application";
import { type Platform } from "../domain/platform.entity";
import type { MakePlatformProps } from "../domain/platform.entity.types";

export type PlatformFactory = TestEntityFactory<MakePlatformProps, Platform>;

export type PlatformFactoryDeps = {
	platformFactory: IPlatformFactoryPort;
};

export const makePlatformFactory = ({ platformFactory }: PlatformFactoryDeps): PlatformFactory => {
	const propOrDefault = <T, V>(prop: T | undefined, value: V) => {
		if (prop === undefined) return value;
		return prop;
	};

	const build: PlatformFactory["build"] = (props = {}) => {
		const recent = faker.date.recent();

		return platformFactory.create({
			id: PlatformIdParser.fromExternal(propOrDefault(props.id, faker.string.uuid())),
			name: propOrDefault(props.name, faker.lorem.words({ min: 1, max: 4 })),
			specificationId: propOrDefault(props.specificationId, faker.string.uuid()),
			background: propOrDefault(props.background, faker.internet.url()),
			cover: propOrDefault(props.cover, faker.internet.url()),
			icon: propOrDefault(props.icon, faker.internet.url()),
			lastUpdatedAt: propOrDefault(props.lastUpdatedAt, recent),
			createdAt: propOrDefault(props.createdAt, recent),
		});
	};

	const buildList: PlatformFactory["buildList"] = (n, props = {}) => {
		return Array.from({ length: n }, () => build(props));
	};

	return { build, buildList };
};
