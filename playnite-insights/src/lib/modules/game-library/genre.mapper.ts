import type { GenreResponseDto } from "@playatlas/game-library/dtos";
import type { IClientEntityMapper } from "../common/common/client-entity.mapper";
import type { Genre } from "./domain/genre.entity";

export const genreMapper: IClientEntityMapper<Genre, GenreResponseDto> = {
	toDomain: (dto) => {
		return {
			...dto,
			SourceUpdatedAt: new Date(),
		};
	},
};
