import type { GenreId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Genre } from "../domain/genre.entity";
import type { GenreRepositoryFilters } from "./genre.repository.types";

export type IGenreRepositoryPort = IEntityRepositoryPort<GenreId, Genre, GenreRepositoryFilters>;
