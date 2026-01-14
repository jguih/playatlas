import type { GenreResponseDto } from "../../dtos/genre.response.dto";
import type { IGenreRepositoryPort } from "../../infra/genre.repository.port";

export type GetAllGenresQueryHandlerDeps = {
	genreRepository: IGenreRepositoryPort;
};

export type GetAllGenresQueryResult =
	| { type: "not_modified" }
	| { type: "ok"; data: GenreResponseDto[]; etag: string };
