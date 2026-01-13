import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Genre, GenreId } from "../domain/genre.entity";

export type IGenreRepositoryPort = IEntityRepositoryPort<GenreId, Genre> & {};
