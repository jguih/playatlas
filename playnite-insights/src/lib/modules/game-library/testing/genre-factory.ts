import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import type { Genre } from "../domain/genre.entity";

export type IGenreFactoryPort = IClientEntityFactoryPort<Genre>;

export class GenreFactory implements IGenreFactoryPort {
	private buildGenre = (): Genre => {
		return {
			Id: faker.string.uuid(),
			Name: faker.word.noun(),
			SourceUpdatedAt: faker.date.recent(),
		};
	};

	build: IGenreFactoryPort["build"] = () => {
		return this.buildGenre();
	};

	buildList: IGenreFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildGenre());
	};
}
