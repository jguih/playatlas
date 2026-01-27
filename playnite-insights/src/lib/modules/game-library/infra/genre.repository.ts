import type { SyncStatus } from "$lib/modules/common/common";
import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { IGenreMapperPort } from "../application/genre.mapper.port";
import type { Genre, GenreId } from "../domain/genre.entity";
import type { IGenreRepositoryPort } from "./genre.repository.port";
import { genreRepositoryMeta } from "./genre.repository.schema";

export type GenreModel = {
	Id: GenreId;
	Name: string;
	SourceUpdatedAt: Date;
	SourceUpdatedAtMs: number;
	SourceDeletedAt?: Date;
	SourceDeleteAfter?: Date;

	Sync: {
		Status: SyncStatus;
		ErrorMessage?: string | null;
		LastSyncedAt: Date;
	};
};

export type GenreRepositoryDeps = ClientEntityRepositoryDeps & {
	genreMapper: IGenreMapperPort;
};

export class GenreRepository
	extends ClientEntityRepository<GenreId, Genre, GenreModel>
	implements IGenreRepositoryPort
{
	constructor({ dbSignal, genreMapper }: GenreRepositoryDeps) {
		super({ dbSignal, storeName: genreRepositoryMeta.storeName, mapper: genreMapper });
	}
}
