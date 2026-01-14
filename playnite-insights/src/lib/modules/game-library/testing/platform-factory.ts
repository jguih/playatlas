import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import type { Platform } from "../domain/platform.entity";

export type IPlatformFactoryPort = IClientEntityFactoryPort<Platform>;

export class PlatformFactory implements IPlatformFactoryPort {
	private buildPlatform = (): Platform => {
		const getImagePath = () => {
			return faker.helpers.arrayElement([faker.image.url(), null]);
		};

		return {
			Id: faker.string.uuid(),
			Name: faker.word.noun(),
			SourceUpdatedAt: faker.date.recent(),
			SpecificationId: faker.string.uuid(),
			Background: getImagePath(),
			Cover: getImagePath(),
			Icon: getImagePath(),
		};
	};

	build: IPlatformFactoryPort["build"] = () => {
		return this.buildPlatform();
	};

	buildList: IPlatformFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildPlatform());
	};
}
