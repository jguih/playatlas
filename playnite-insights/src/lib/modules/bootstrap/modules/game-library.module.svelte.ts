import {
	SyncGamesCommandHandler,
	type ISyncGamesCommandHandlerPort,
} from '$lib/modules/game-library/commands/sync-games';
import {
	SyncGenresCommandHandler,
	type ISyncGenresCommandHandlerPort,
} from '$lib/modules/game-library/commands/sync-genres';
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
import {
	GetGenresByIdQueryHandler,
	type IGetGenreByIdQueryHandlerPort,
} from '$lib/modules/game-library/queries/get-genre-by-id';
import {
	GetGenresByIdsQueryHandler,
	type IGetGenresByIdsQueryHandlerPort,
} from '$lib/modules/game-library/queries/get-genres-by-ids';
import type { IClientGameLibraryModulePort } from './game-library.module.port';
import type { IndexedDbSignal } from './infra.module.port';

export type ClientGameLibraryModuleDeps = {
	indexedDbSignal: IndexedDbSignal;
};

export class ClientGameLibraryModule implements IClientGameLibraryModulePort {
	readonly gameRepository: IGameRepositoryPort;
	readonly genreRepository: IGenreRepositoryPort;
	readonly getGamesQueryHandler: IGetGamesQueryHandlerPort;
	readonly getGenreByIdQueryHandler: IGetGenreByIdQueryHandlerPort;
	readonly getGenresByIdsQueryHandler: IGetGenresByIdsQueryHandlerPort;
	readonly syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	readonly syncGenresCommandHandler: ISyncGenresCommandHandlerPort;

	constructor({ indexedDbSignal }: ClientGameLibraryModuleDeps) {
		this.gameRepository = new GameRepository({ indexedDbSignal });
		this.genreRepository = new GenreRepository({ indexedDbSignal });
		this.getGamesQueryHandler = new GetGamesQueryHandler({ gameRepository: this.gameRepository });
		this.getGenreByIdQueryHandler = new GetGenresByIdQueryHandler({
			genreRepository: this.genreRepository,
		});
		this.getGenresByIdsQueryHandler = new GetGenresByIdsQueryHandler({
			genreRepository: this.genreRepository,
		});
		this.syncGamesCommandHandler = new SyncGamesCommandHandler({
			gameRepository: this.gameRepository,
		});
		this.syncGenresCommandHandler = new SyncGenresCommandHandler({
			genreRepository: this.genreRepository,
		});
	}
}
