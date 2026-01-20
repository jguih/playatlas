import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { Genre, GenreId } from "../domain/genre.entity";
import type { IGenreRepositoryPort } from "./genre.repository.port";
import { genreRepositoryMeta } from "./genre.repository.schema";

export type GenreRepositoryDeps = ClientEntityRepositoryDeps;

export class GenreRepository
	extends ClientEntityRepository<Genre, GenreId>
	implements IGenreRepositoryPort
{
	constructor({ dbSignal }: ClientEntityRepositoryDeps) {
		super({ dbSignal, storeName: genreRepositoryMeta.storeName });
	}
}
