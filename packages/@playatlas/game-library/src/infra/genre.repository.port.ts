import type { GenreId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Genre } from "../domain/genre.entity";

export type IGenreRepositoryPort = IEntityRepositoryPort<GenreId, Genre> & {};
