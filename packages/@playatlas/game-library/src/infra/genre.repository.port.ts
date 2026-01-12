import { EntityRepository } from "@playatlas/common/infra";
import { Genre, GenreId } from "../domain/genre.entity";

export type IGenreRepositoryPort = EntityRepository<GenreId, Genre> & {};
