import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import {
	PlatformIdParser,
	PlaynitePlatformIdParser,
	type Platform,
} from "../domain/platform.entity";

export type IPlatformFactoryPort = IClientEntityFactoryPort<Platform>;

export class PlatformFactory implements IPlatformFactoryPort {
	private buildPlatform = (): Platform => {
		const SourceUpdatedAt = faker.date.recent();

		return {
			Id: PlatformIdParser.fromTrusted(faker.string.ulid()),
			Name: faker.word.noun(),
			Playnite: {
				Id: PlaynitePlatformIdParser.fromTrusted(faker.string.uuid()),
				SpecificationId: faker.string.uuid(),
			},
			SourceUpdatedAt,
			SourceUpdatedAtMs: SourceUpdatedAt.getTime(),
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
