import {
	SyncGamesCommandHandler,
	type ISyncGamesCommandHandlerPort,
} from '$lib/modules/game-library/commands/sync-games';
import {
	GameRepository,
	GenreRepository,
	type IGameRepositoryPort,
	type IGenreRepositoryPort,
} from '$lib/modules/game-library/infra';
import {
	GetGamesQueryHandler,
	type IGetGamesQueryHandlerPort,
} from '$lib/modules/game-library/queries/get-games';
import type { IClientGameLibraryModulePort } from './game-library.module.port';
import type { IndexedDbSignal } from './infra.module.port';

export type ClientGameLibraryModuleDeps = {
	indexedDbSignal: IndexedDbSignal;
};

export class ClientGameLibraryModule implements IClientGameLibraryModulePort {
	readonly gameRepository: IGameRepositoryPort;
	readonly genreRepository: IGenreRepositoryPort;
	readonly getGamesQueryHandler: IGetGamesQueryHandlerPort;
	readonly syncGamesCommandHandler: ISyncGamesCommandHandlerPort;

	constructor({ indexedDbSignal }: ClientGameLibraryModuleDeps) {
		this.gameRepository = new GameRepository({ indexedDbSignal });
		this.genreRepository = new GenreRepository({ indexedDbSignal });
		this.getGamesQueryHandler = new GetGamesQueryHandler({ gameRepository: this.gameRepository });
		this.syncGamesCommandHandler = new SyncGamesCommandHandler({
			gameRepository: this.gameRepository,
		});
	}
}
