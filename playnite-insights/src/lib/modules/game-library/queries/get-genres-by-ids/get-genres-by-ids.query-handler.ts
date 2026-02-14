import type { IGenreRepositoryPort } from "../../infra/genre.repository.port";
import type { GetGenresByIdsQuery, GetGenresByIdsQueryResult } from "./get-genres-by-ids.query";
import type { IGetGenresByIdsQueryHandlerPort } from "./get-genres-by-ids.query-handler.port";

export type GetGenresByIdsQueryHandlerDeps = {
	genreRepository: IGenreRepositoryPort;
};

export class GetGenresByIdsQueryHandler implements IGetGenresByIdsQueryHandlerPort {
	private readonly genreRepository: IGenreRepositoryPort;

	constructor({ genreRepository }: GetGenresByIdsQueryHandlerDeps) {
		this.genreRepository = genreRepository;
	}

	async executeAsync({ genreIds }: GetGenresByIdsQuery): Promise<GetGenresByIdsQueryResult> {
		const genres = await this.genreRepository.getByIdsAsync(genreIds);
		return { genres: genres.values().toArray() };
	}
}
