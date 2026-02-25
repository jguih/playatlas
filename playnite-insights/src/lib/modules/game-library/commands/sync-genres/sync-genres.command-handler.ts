import type { IAsyncCommandHandlerPort } from "$lib/modules/common/common";
import type { IGenreRepositoryPort } from "../../infra";
import type { SyncGenresCommand } from "./sync-genres.command";

export type ISyncGenresCommandHandlerPort = IAsyncCommandHandlerPort<SyncGenresCommand, void>;

export type SyncGenresCommandHandlerDeps = {
	genreRepository: IGenreRepositoryPort;
};

export class SyncGenresCommandHandler implements ISyncGenresCommandHandlerPort {
	private readonly genreRepository: IGenreRepositoryPort;

	constructor({ genreRepository }: SyncGenresCommandHandlerDeps) {
		this.genreRepository = genreRepository;
	}

	async executeAsync(command: SyncGenresCommand): Promise<void> {
		await this.genreRepository.syncAsync(command.genres);
	}
}
