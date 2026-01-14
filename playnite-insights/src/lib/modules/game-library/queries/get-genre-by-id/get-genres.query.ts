import type { Genre, GenreId } from "../../domain/genre.entity";

export type GetGenreByIdQuery = {
	genreId: GenreId;
};

export type GetGenreByIdQueryResult = {
	genre: Genre | null;
};
