import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import { PlatformIdParser, type Platform } from "../domain/platform.entity";

export type IPlatformFactoryPort = IClientEntityFactoryPort<Platform>;

export class PlatformFactory implements IPlatformFactoryPort {
	private buildPlatform = (): Platform => {
		const getImagePath = () => {
			return faker.helpers.arrayElement([faker.image.url(), null]);
		};

		const SourceUpdatedAt = faker.date.recent();

		return {
			Id: PlatformIdParser.fromTrusted(faker.string.uuid()),
			Name: faker.word.noun(),
			SourceUpdatedAt,
			SourceUpdatedAtMs: SourceUpdatedAt.getTime(),
			SpecificationId: faker.string.uuid(),
			Background: getImagePath(),
			Cover: getImagePath(),
			Icon: getImagePath(),
			Sync: {
				Status: "synced",
				LastSyncedAt: faker.date.recent(),
				ErrorMessage: null,
			},
		};
	};

	build: IPlatformFactoryPort["build"] = () => {
		return this.buildPlatform();
	};

	buildList: IPlatformFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildPlatform());
	};
}
