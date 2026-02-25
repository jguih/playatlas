import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { GenreResponseDto } from "@playatlas/game-library/dtos";
import type { Genre, GenreId } from "../domain/genre.entity";
import type { GenreModel } from "../infra";

export type IGenreMapperPort = IClientEntityMapper<GenreId, Genre, GenreModel> & {
	fromDto: (dto: GenreResponseDto, lastSync?: Date | null) => Genre;
};
