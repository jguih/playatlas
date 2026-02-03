import type { IDomainEventBusPort, IHttpClientPort } from "$lib/modules/common/application";
import type { IClockPort } from "$lib/modules/common/application/clock.port";
import {
	type ICompanyMapperPort,
	type ICompletionStatusMapperPort,
	type IGameLibraryFilterMapperPort,
	type IGameLibrarySyncManagerPort,
	type IGameLibrarySyncStatePort,
	type IGameMapperPort,
	type IGenreMapperPort,
	type IPlatformMapperPort,
	type IPlayAtlasClientPort,
	type ISyncCompaniesFlowPort,
	type ISyncCompletionStatusesFlowPort,
	type ISyncGamesFlowPort,
	type ISyncGenresFlowPort,
	type ISyncPlatformsFlowPort,
	CompanyMapper,
	CompletionStatusMapper,
	GameLibraryFilterMapper,
	GameLibrarySyncManager,
	GameMapper,
	GenreMapper,
	PlatformMapper,
	PlayAtlasClient,
	SyncCompaniesFlow,
	SyncCompletionStatusesFlow,
	SyncGamesFlow,
	SyncGenresFlow,
	SyncPlatformsFlow,
	SyncProgressReport,
} from "$lib/modules/game-library/application";
import type { ISyncProgressReporterPort } from "$lib/modules/game-library/application/sync-progress-reporter.svelte";
import {
	type ISyncRunnerPort,
	SyncRunner,
} from "$lib/modules/game-library/application/sync-runner";
import {
	type ICreateGameLibraryCommandHandler,
	type ISyncCompaniesCommandHandlerPort,
	type ISyncCompletionStatusesCommandHandlerPort,
	type ISyncGamesCommandHandlerPort,
	type ISyncGenresCommandHandlerPort,
	type ISyncPlatformsCommandHandlerPort,
	CreateGameLibraryFilterCommandHandler,
	SyncCompaniesCommandHandler,
	SyncCompletionStatusesCommandHandler,
	SyncGamesCommandHandler,
	SyncGenresCommandHandler,
	SyncPlatformsCommandHandler,
} from "$lib/modules/game-library/commands";
import {
	type ICompanyRepositoryPort,
	type ICompletionStatusRepositoryPort,
	type IGameLibraryFilterHasherPort,
	type IGameLibraryFilterRepositoryPort,
	type IGameRepositoryPort,
	type IGenreRepositoryPort,
	type IPlatformRepositoryPort,
	CompanyRepository,
	CompletionStatusRepository,
	GameLibraryFilterHasher,
	GameLibraryFilterRepository,
	GameLibrarySyncState,
	GameRepository,
	GenreRepository,
	PlatformRepository,
} from "$lib/modules/game-library/infra";
import {
	type IGetCompaniesByIdsQueryHandlerPort,
	type IGetCompletionStatusesByIdsQueryHandlerPort,
	type IGetGameLibraryFiltersQueryHandlerPort,
	type IGetGamesByIdsQueryHandlerPort,
	type IGetGamesQueryHandlerFilterBuilderProps,
	type IGetGamesQueryHandlerPort,
	type IGetGenreByIdQueryHandlerPort,
	type IGetGenresByIdsQueryHandlerPort,
	type IGetPlatformsByIdsQueryHandlerPort,
	GetCompaniesByIdsQueryHandler,
	GetCompletionStatusesByIdsQueryHandler,
	GetGameLibraryFiltersQueryHandler,
	GetGamesByIdsQueryHandler,
	GetGamesQueryHandler,
	GetGamesQueryHandlerFilterBuilder,
	GetGenresByIdQueryHandler,
	GetGenresByIdsQueryHandler,
	GetPlatformsByIdsQueryHandler,
} from "$lib/modules/game-library/queries";
import type { IClientGameLibraryModulePort } from "./game-library.module.port";

export type ClientGameLibraryModuleDeps = {
	dbSignal: IDBDatabase;
	httpClient: IHttpClientPort;
	clock: IClockPort;
	eventBus: IDomainEventBusPort;
};

export class ClientGameLibraryModule implements IClientGameLibraryModulePort {
	readonly gameMapper: IGameMapperPort;
	readonly gameRepository: IGameRepositoryPort;
	readonly getGamesQueryHandlerFilterBuilder: IGetGamesQueryHandlerFilterBuilderProps;
	readonly getGamesQueryHandler: IGetGamesQueryHandlerPort;
	readonly getGamesByIdsQueryHandler: IGetGamesByIdsQueryHandlerPort;
	readonly syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	readonly syncGamesFlow: ISyncGamesFlowPort;

	readonly genreMapper: IGenreMapperPort;
	readonly genreRepository: IGenreRepositoryPort;
	readonly getGenreByIdQueryHandler: IGetGenreByIdQueryHandlerPort;
	readonly getGenresByIdsQueryHandler: IGetGenresByIdsQueryHandlerPort;
	readonly syncGenresCommandHandler: ISyncGenresCommandHandlerPort;
	readonly syncGenresFlow: ISyncGenresFlowPort;

	readonly companyMapper: ICompanyMapperPort;
	readonly companyRepository: ICompanyRepositoryPort;
	readonly getCompaniesByIdsQueryHandler: IGetCompaniesByIdsQueryHandlerPort;
	readonly syncCompaniesCommandHandler: ISyncCompaniesCommandHandlerPort;
	readonly syncCompaniesFlow: ISyncCompaniesFlowPort;

	readonly platformMapper: IPlatformMapperPort;
	readonly platformRepository: IPlatformRepositoryPort;
	readonly getPlatformsByIdsQueryHandler: IGetPlatformsByIdsQueryHandlerPort;
	readonly syncPlatformsCommandHandler: ISyncPlatformsCommandHandlerPort;
	readonly syncPlatformsFlow: ISyncPlatformsFlowPort;

	readonly completionStatusMapper: ICompletionStatusMapperPort;
	readonly completionStatusRepository: ICompletionStatusRepositoryPort;
	readonly getCompletionStatusesByIdsQueryHandler: IGetCompletionStatusesByIdsQueryHandlerPort;
	readonly syncCompletionStatusesCommandHandler: ISyncCompletionStatusesCommandHandlerPort;
	readonly syncCompletionStatusesFlow: ISyncCompletionStatusesFlowPort;

	readonly playAtlasClient: IPlayAtlasClientPort;
	readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	readonly gameLibrarySyncManager: IGameLibrarySyncManagerPort;
	readonly syncProgressReporter: ISyncProgressReporterPort;

	readonly gameLibraryFilterMapper: IGameLibraryFilterMapperPort;
	readonly gameLibraryFilterRepository: IGameLibraryFilterRepositoryPort;
	readonly gameLibraryFilterHasher: IGameLibraryFilterHasherPort;
	readonly createGameLibraryFilterCommandHandler: ICreateGameLibraryCommandHandler;
	readonly getGameLibraryFiltersQueryHandler: IGetGameLibraryFiltersQueryHandlerPort;

	constructor({ dbSignal, httpClient, clock, eventBus }: ClientGameLibraryModuleDeps) {
		this.playAtlasClient = new PlayAtlasClient({ httpClient });
		this.gameLibrarySyncState = new GameLibrarySyncState();
		const syncRunner: ISyncRunnerPort = new SyncRunner({
			clock,
			gameLibrarySyncState: this.gameLibrarySyncState,
		});
		this.syncProgressReporter = new SyncProgressReport();

		this.gameMapper = new GameMapper({ clock });
		this.gameRepository = new GameRepository({ dbSignal, gameMapper: this.gameMapper });
		this.getGamesQueryHandlerFilterBuilder = new GetGamesQueryHandlerFilterBuilder();
		this.getGamesQueryHandler = new GetGamesQueryHandler({
			gameRepository: this.gameRepository,
			filterBuilder: this.getGamesQueryHandlerFilterBuilder,
		});
		this.getGamesByIdsQueryHandler = new GetGamesByIdsQueryHandler({
			gameRepository: this.gameRepository,
		});
		this.syncGamesCommandHandler = new SyncGamesCommandHandler({
			gameRepository: this.gameRepository,
		});
		this.syncGamesFlow = new SyncGamesFlow({
			gameMapper: this.gameMapper,
			playAtlasClient: this.playAtlasClient,
			syncGamesCommandHandler: this.syncGamesCommandHandler,
			syncRunner,
		});

		this.genreMapper = new GenreMapper({ clock });
		this.genreRepository = new GenreRepository({ dbSignal, genreMapper: this.genreMapper });
		this.getGenreByIdQueryHandler = new GetGenresByIdQueryHandler({
			genreRepository: this.genreRepository,
		});
		this.getGenresByIdsQueryHandler = new GetGenresByIdsQueryHandler({
			genreRepository: this.genreRepository,
		});
		this.syncGenresCommandHandler = new SyncGenresCommandHandler({
			genreRepository: this.genreRepository,
		});
		this.syncGenresFlow = new SyncGenresFlow({
			genreMapper: this.genreMapper,
			playAtlasClient: this.playAtlasClient,
			syncGenresCommandHandler: this.syncGenresCommandHandler,
			syncRunner,
		});

		this.companyMapper = new CompanyMapper({ clock });
		this.companyRepository = new CompanyRepository({ dbSignal, companyMapper: this.companyMapper });
		this.getCompaniesByIdsQueryHandler = new GetCompaniesByIdsQueryHandler({
			companyRepository: this.companyRepository,
		});
		this.syncCompaniesCommandHandler = new SyncCompaniesCommandHandler({
			companyRepository: this.companyRepository,
		});
		this.syncCompaniesFlow = new SyncCompaniesFlow({
			companyMapper: this.companyMapper,
			playAtlasClient: this.playAtlasClient,
			syncCompaniesCommandHandler: this.syncCompaniesCommandHandler,
			syncRunner,
		});

		this.platformMapper = new PlatformMapper({ clock });
		this.platformRepository = new PlatformRepository({
			dbSignal,
			platformMapper: this.platformMapper,
		});
		this.getPlatformsByIdsQueryHandler = new GetPlatformsByIdsQueryHandler({
			platformRepository: this.platformRepository,
		});
		this.syncPlatformsCommandHandler = new SyncPlatformsCommandHandler({
			platformRepository: this.platformRepository,
		});
		this.syncPlatformsFlow = new SyncPlatformsFlow({
			platformMapper: this.platformMapper,
			playAtlasClient: this.playAtlasClient,
			syncPlatformsCommandHandler: this.syncPlatformsCommandHandler,
			syncRunner,
		});

		this.completionStatusMapper = new CompletionStatusMapper({ clock });
		this.completionStatusRepository = new CompletionStatusRepository({
			dbSignal,
			completionStatusMapper: this.completionStatusMapper,
		});
		this.getCompletionStatusesByIdsQueryHandler = new GetCompletionStatusesByIdsQueryHandler({
			completionStatusRepository: this.completionStatusRepository,
		});
		this.syncCompletionStatusesCommandHandler = new SyncCompletionStatusesCommandHandler({
			completionStatusRepository: this.completionStatusRepository,
		});
		this.syncCompletionStatusesFlow = new SyncCompletionStatusesFlow({
			completionStatusMapper: this.completionStatusMapper,
			playAtlasClient: this.playAtlasClient,
			syncCompletionStatusesCommandHandler: this.syncCompletionStatusesCommandHandler,
			syncRunner,
		});

		this.gameLibrarySyncManager = new GameLibrarySyncManager({
			syncCompletionStatusesFlow: this.syncCompletionStatusesFlow,
			syncGamesFlow: this.syncGamesFlow,
			syncCompaniesFlow: this.syncCompaniesFlow,
			syncGenresFlow: this.syncGenresFlow,
			syncPlatformsFlow: this.syncPlatformsFlow,
			progressReporter: this.syncProgressReporter,
			clock,
			eventBus,
		});

		this.gameLibraryFilterMapper = new GameLibraryFilterMapper();
		this.gameLibraryFilterRepository = new GameLibraryFilterRepository({
			dbSignal,
			gameLibraryFilterMapper: this.gameLibraryFilterMapper,
		});
		this.gameLibraryFilterHasher = new GameLibraryFilterHasher();
		this.createGameLibraryFilterCommandHandler = new CreateGameLibraryFilterCommandHandler({
			clock,
			gameLibraryFilterRepository: this.gameLibraryFilterRepository,
			hasher: this.gameLibraryFilterHasher,
		});
		this.getGameLibraryFiltersQueryHandler = new GetGameLibraryFiltersQueryHandler({
			gameLibraryFilterRepository: this.gameLibraryFilterRepository,
		});
	}
}
