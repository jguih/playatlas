import type { IGenreRepositoryPort } from '../../infra/genre.repository.port';
import type { GetGenreByIdQuery, GetGenreByIdQueryResult } from './get-genres.query';
import type { IGetGenreByIdQueryHandlerPort } from './get-genres.query-handler.port';

export type GetGenresQueryHandlerDeps = {
	genreRepository: IGenreRepositoryPort;
};

export class GetGenresByIdQueryHandler implements IGetGenreByIdQueryHandlerPort {
	private readonly genreRepository: IGenreRepositoryPort;

	constructor({ genreRepository }: GetGenresQueryHandlerDeps) {
		this.genreRepository = genreRepository;
	}

	async executeAsync({ genreId }: GetGenreByIdQuery): Promise<GetGenreByIdQueryResult> {
		const genre = await this.genreRepository.getByIdAsync(genreId);
		return { genre };
	}
}
