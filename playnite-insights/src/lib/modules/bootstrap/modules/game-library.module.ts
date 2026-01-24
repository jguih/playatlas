import type { IHttpClientPort } from "$lib/modules/common/application";
import type { IClockPort } from "$lib/modules/common/application/clock.port";
import {
	type IGameLibrarySyncStatePort,
	type IGameMapperPort,
	type IPlayAtlasClientPort,
	type ISyncGameLibraryServicePort,
	GameMapper,
	PlayAtlasClient,
	SyncGameLibraryService,
} from "$lib/modules/game-library/application";
import {
	type ISyncCompaniesCommandHandlerPort,
	type ISyncGamesCommandHandlerPort,
	type ISyncGenresCommandHandlerPort,
	type ISyncPlatformsCommandHandlerPort,
	SyncCompaniesCommandHandler,
	SyncGamesCommandHandler,
	SyncGenresCommandHandler,
	SyncPlatformsCommandHandler,
} from "$lib/modules/game-library/commands";
import {
	type ICompanyRepositoryPort,
	type IGameRepositoryPort,
	type IGenreRepositoryPort,
	type IPlatformRepositoryPort,
	CompanyRepository,
	GameRepository,
	GenreRepository,
	PlatformRepository,
} from "$lib/modules/game-library/infra";
import { GameLibrarySyncState } from "$lib/modules/game-library/infra/game-library-sync-state";
import {
	type IGetCompaniesByIdsQueryHandlerPort,
	type IGetGamesByIdsQueryHandlerPort,
	type IGetGamesQueryHandlerPort,
	type IGetGenreByIdQueryHandlerPort,
	type IGetGenresByIdsQueryHandlerPort,
	type IGetPlatformsByIdsQueryHandlerPort,
	GetCompaniesByIdsQueryHandler,
	GetGamesByIdsQueryHandler,
	GetGamesQueryHandler,
	GetGenresByIdQueryHandler,
	GetGenresByIdsQueryHandler,
	GetPlatformsByIdsQueryHandler,
} from "$lib/modules/game-library/queries";
import type { IClientGameLibraryModulePort } from "./game-library.module.port";

export type ClientGameLibraryModuleDeps = {
	dbSignal: IDBDatabase;
	httpClient: IHttpClientPort;
	clock: IClockPort;
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

	readonly gameMapper: IGameMapperPort;

	readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	readonly syncGameLibraryService: ISyncGameLibraryServicePort;

	constructor({ dbSignal, httpClient, clock }: ClientGameLibraryModuleDeps) {
		this.gameRepository = new GameRepository({ dbSignal });
		this.genreRepository = new GenreRepository({ dbSignal });
		this.companyRepository = new CompanyRepository({ dbSignal });
		this.platformRepository = new PlatformRepository({ dbSignal });

		this.gameMapper = new GameMapper({ clock });

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

		this.playAtlasClient = new PlayAtlasClient({ httpClient, gameMapper: this.gameMapper });

		this.gameLibrarySyncState = new GameLibrarySyncState();
		this.syncGameLibraryService = new SyncGameLibraryService({
			clock,
			gameLibrarySyncState: this.gameLibrarySyncState,
			gameMapper: this.gameMapper,
			playAtlasClient: this.playAtlasClient,
			syncGamesCommandHandler: this.syncGamesCommandHandler,
		});
	}
}
