import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import type { Game } from "../domain";

export type IGameFactoryPort = IClientEntityFactoryPort<Game>;

export class GameFactory implements IGameFactoryPort {
	private buildGame = (): Game => {
		return {
			Id: faker.string.uuid(),
			Name: faker.lorem.words({ min: 1, max: 4 }),
			Description: faker.lorem.paragraphs({ min: 1, max: 5 }),
			ReleaseDate: faker.date.past(),
			Playtime: faker.number.int({ min: 10 }),
			LastActivity: faker.date.recent(),
			Added: faker.date.past(),
			InstallDirectory: faker.system.directoryPath(),
			IsInstalled: faker.datatype.boolean(),
			BackgroundImagePath: faker.image.url(),
			CoverImagePath: faker.image.url(),
			IconImagePath: faker.image.url(),
			Hidden: faker.datatype.boolean(),
			CompletionStatusId: faker.string.uuid(),
			ContentHash: faker.string.uuid(),
			Developers: [],
			Publishers: [],
			Genres: [],
			Platforms: [],
			SourceUpdatedAt: faker.date.recent(),
			DeleteAfter: null,
			DeletedAt: null,
			Sync: {
				Status: "synced",
				ErrorMessage: null,
				LastSyncedAt: faker.date.recent(),
			},
		};
	};

	build: IGameFactoryPort["build"] = () => {
		return this.buildGame();
	};

	buildList: IGameFactoryPort["buildList"] = (n) => {
		const arr = Array.from({ length: n }, () => this.buildGame());
		return arr;
	};
}
