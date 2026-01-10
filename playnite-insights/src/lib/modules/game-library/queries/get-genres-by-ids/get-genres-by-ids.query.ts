import type { Genre, GenreId } from '../../domain/genre.entity';

export type GetGenresByIdsQuery = {
	genreIds: GenreId[];
};

export type GetGenresByIdsQueryResult = {
	genres: Genre[];
};
