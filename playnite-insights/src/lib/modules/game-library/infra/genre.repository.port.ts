import type { IClientEntityRepository } from "$lib/modules/common/infra";
import type { Genre, GenreId } from "../domain/genre.entity";

export type IGenreRepositoryPort = IClientEntityRepository<Genre, GenreId>;
