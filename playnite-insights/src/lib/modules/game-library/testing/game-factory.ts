import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import { GameIdParser, PlayniteGameIdParser, type Game } from "../domain/game.entity";

export type IGameFactoryPort = IClientEntityFactoryPort<Game>;

export class GameFactory implements IGameFactoryPort {
	private buildGame = (): Game => {
		const sourceUpdatedAt = faker.date.recent();

		return {
			Id: GameIdParser.fromTrusted(faker.string.ulid()),
			Playnite: {
				Id: PlayniteGameIdParser.fromTrusted(faker.string.uuid()),
				Name: faker.lorem.words({ min: 1, max: 4 }),
				Description: faker.lorem.paragraphs({ min: 1, max: 5 }),
				ReleaseDate: faker.date.past(),
				Playtime: faker.number.int({ min: 10 }),
				LastActivity: faker.date.recent(),
				Added: faker.date.past(),
				InstallDirectory: faker.system.directoryPath(),
				IsInstalled: faker.datatype.boolean(),
				Hidden: faker.datatype.boolean(),
				CompletionStatusId: faker.string.uuid(),
				IconImagePath: faker.image.url(),
				CoverImagePath: faker.image.url(),
				BackgroundImagePath: faker.image.url(),
			},
			CompletionStatusId: faker.string.uuid(),
			ContentHash: faker.string.uuid(),
			Developers: [],
			Publishers: [],
			Genres: [],
			Platforms: [],
			SourceUpdatedAt: sourceUpdatedAt,
			SourceUpdatedAtMs: sourceUpdatedAt.getTime(),
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
