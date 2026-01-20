import type { IHttpClientPort } from "$lib/modules/common/application";
import { PlayAtlasClient, type IPlayAtlasClientPort } from "$lib/modules/game-library/application";
import {
	SyncCompaniesCommandHandler,
	type ISyncCompaniesCommandHandlerPort,
} from "$lib/modules/game-library/commands/sync-companies";
import {
	SyncGamesCommandHandler,
	type ISyncGamesCommandHandlerPort,
} from "$lib/modules/game-library/commands/sync-games";
import {
	SyncGenresCommandHandler,
	type ISyncGenresCommandHandlerPort,
} from "$lib/modules/game-library/commands/sync-genres";
import {
	SyncPlatformsCommandHandler,
	type ISyncPlatformsCommandHandlerPort,
} from "$lib/modules/game-library/commands/sync-platforms";
import {
	CompanyRepository,
	GameRepository,
	GenreRepository,
	PlatformRepository,
	type ICompanyRepositoryPort,
	type IGameRepositoryPort,
	type IGenreRepositoryPort,
	type IPlatformRepositoryPort,
} from "$lib/modules/game-library/infra";
import {
	GetCompaniesByIdsQueryHandler,
	type IGetCompaniesByIdsQueryHandlerPort,
} from "$lib/modules/game-library/queries/get-companies-by-ids";
import {
	GetGamesQueryHandler,
	type IGetGamesQueryHandlerPort,
} from "$lib/modules/game-library/queries/get-games";
import {
	GetGamesByIdsQueryHandler,
	type IGetGamesByIdsQueryHandlerPort,
} from "$lib/modules/game-library/queries/get-games-by-ids";
import {
	GetGenresByIdQueryHandler,
	type IGetGenreByIdQueryHandlerPort,
} from "$lib/modules/game-library/queries/get-genre-by-id";
import {
	GetGenresByIdsQueryHandler,
	type IGetGenresByIdsQueryHandlerPort,
} from "$lib/modules/game-library/queries/get-genres-by-ids";
import {
	GetPlatformsByIdsQueryHandler,
	type IGetPlatformsByIdsQueryHandlerPort,
} from "$lib/modules/game-library/queries/get-platforms-by-ids";
import type { IClientGameLibraryModulePort } from "./game-library.module.port";

export type ClientGameLibraryModuleDeps = {
	dbSignal: IDBDatabase;
	httpClient: IHttpClientPort;
};

export class ClientGameLibraryModule implements IClientGameLibraryModulePort {
	readonly gameRepository: IGameRepositoryPort;
	readonly genreRepository: IGenreRepositoryPort;
	readonly companyRepository: ICompanyRepositoryPort;
	readonly platformRepository: IPlatformRepositoryPort;

	readonly getGamesQueryHandler: IGetGamesQueryHandlerPort;
	readonly getGamesByIdsQueryHandler: IGetGamesByIdsQueryHandlerPort;
	readonly getGenreByIdQueryHandler: IGetGenreByIdQueryHandlerPort;
	readonly getGenresByIdsQueryHandler: IGetGenresByIdsQueryHandlerPort;
	readonly getCompaniesByIdsQueryHandler: IGetCompaniesByIdsQueryHandlerPort;
	readonly getPlatformsByIdsQueryHandler: IGetPlatformsByIdsQueryHandlerPort;

	readonly syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	readonly syncGenresCommandHandler: ISyncGenresCommandHandlerPort;
	readonly syncCompaniesCommandHandler: ISyncCompaniesCommandHandlerPort;
	readonly syncPlatformsCommandHandler: ISyncPlatformsCommandHandlerPort;

	readonly playAtlasClient: IPlayAtlasClientPort;

	constructor({ dbSignal, httpClient }: ClientGameLibraryModuleDeps) {
		this.gameRepository = new GameRepository({ dbSignal });
		this.genreRepository = new GenreRepository({ dbSignal });
		this.companyRepository = new CompanyRepository({ dbSignal });
		this.platformRepository = new PlatformRepository({ dbSignal });

		this.getGamesQueryHandler = new GetGamesQueryHandler({ gameRepository: this.gameRepository });
		this.getGamesByIdsQueryHandler = new GetGamesByIdsQueryHandler({
			gameRepository: this.gameRepository,
		});
		this.getGenreByIdQueryHandler = new GetGenresByIdQueryHandler({
			genreRepository: this.genreRepository,
		});
		this.getGenresByIdsQueryHandler = new GetGenresByIdsQueryHandler({
			genreRepository: this.genreRepository,
		});
		this.getCompaniesByIdsQueryHandler = new GetCompaniesByIdsQueryHandler({
			companyRepository: this.companyRepository,
		});
		this.getPlatformsByIdsQueryHandler = new GetPlatformsByIdsQueryHandler({
			platformRepository: this.platformRepository,
		});

		this.syncGamesCommandHandler = new SyncGamesCommandHandler({
			gameRepository: this.gameRepository,
		});
		this.syncGenresCommandHandler = new SyncGenresCommandHandler({
			genreRepository: this.genreRepository,
		});
		this.syncCompaniesCommandHandler = new SyncCompaniesCommandHandler({
			companyRepository: this.companyRepository,
		});
		this.syncPlatformsCommandHandler = new SyncPlatformsCommandHandler({
			platformRepository: this.platformRepository,
		});

		this.playAtlasClient = new PlayAtlasClient({ httpClient });
	}
}
