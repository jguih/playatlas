import type { ILogServicePort } from "@playatlas/common/application";
import type { IClockPort, SyncCursor } from "@playatlas/common/infra";
import type { IGenreMapperPort } from "../../application";
import type { GenreResponseDto } from "../../dtos/genre.response.dto";
import type { IGenreRepositoryPort } from "../../infra/genre.repository.port";

export type GetAllGenresQueryHandlerDeps = {
	genreRepository: IGenreRepositoryPort;
	genreMapper: IGenreMapperPort;
	logService: ILogServicePort;
	clock: IClockPort;
};

export type GetAllGenresQueryResult = { data: GenreResponseDto[]; nextCursor: SyncCursor };
