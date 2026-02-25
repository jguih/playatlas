import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import { GenreIdParser, type Genre } from "../domain/genre.entity";

export type IGenreFactoryPort = IClientEntityFactoryPort<Genre>;

export class GenreFactory implements IGenreFactoryPort {
	private buildGenre = (): Genre => {
		return {
			Id: GenreIdParser.fromTrusted(faker.string.ulid()),
			Name: faker.word.noun(),
			SourceLastUpdatedAt: faker.date.recent(),
			Sync: {
				Status: "synced",
				LastSyncedAt: faker.date.recent(),
				ErrorMessage: null,
			},
		};
	};

	build: IGenreFactoryPort["build"] = () => {
		return this.buildGenre();
	};

	buildList: IGenreFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildGenre());
	};
}
