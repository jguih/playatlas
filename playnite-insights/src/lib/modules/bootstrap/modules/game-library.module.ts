import type { IDomainEventBusPort } from "$lib/modules/common/application";
import type { IClockPort } from "$lib/modules/common/application/clock.port";
import type { IPlayAtlasClientPort } from "$lib/modules/common/application/playatlas-client.port";
import { type ISyncRunnerPort } from "$lib/modules/common/application/sync-runner.port";
import {
	type ICompanyMapperPort,
	type ICompletionStatusMapperPort,
	type IGameClassificationMapperPort,
	type IGameLibraryFilterMapperPort,
	type IGameMapperPort,
	type IGameRecommendationRecordProjectionServicePort,
	type IGameRecommendationRecordProjectionWriterPort,
	type IGameVectorProjectionServicePort,
	type IGameVectorProjectionWriterPort,
	type IGenreMapperPort,
	type IInstancePreferenceModelService,
	type IPlatformMapperPort,
	type IRecommendationEnginePort,
	type ISyncCompaniesFlowPort,
	type ISyncCompletionStatusesFlowPort,
	type ISyncGameClassificationsFlowPort,
	type ISyncGamesFlowPort,
	type ISyncGenresFlowPort,
	type ISyncPlatformsFlowPort,
	CompanyMapper,
	CompletionStatusMapper,
	GameClassificationMapper,
	GameLibraryFilterMapper,
	GameMapper,
	GameRecommendationRecordProjectionService,
	GameRecommendationRecordProjectionWriter,
	GameVectorProjectionService,
	GameVectorProjectionWriter,
	GenreMapper,
	InstancePreferenceModelService,
	PlatformMapper,
	RecommendationEngine,
	SyncCompaniesFlow,
	SyncCompletionStatusesFlow,
	SyncGameClassificationsFlow,
	SyncGamesFlow,
	SyncGenresFlow,
	SyncPlatformsFlow,
} from "$lib/modules/game-library/application";
import {
	type ICreateGameLibraryCommandHandler,
	type ISyncCompaniesCommandHandlerPort,
	type ISyncCompletionStatusesCommandHandlerPort,
	type ISyncGameClassificationsCommandHandlerPort,
	type ISyncGamesCommandHandlerPort,
	type ISyncGenresCommandHandlerPort,
	type ISyncPlatformsCommandHandlerPort,
	CreateGameLibraryFilterCommandHandler,
	SyncCompaniesCommandHandler,
	SyncCompletionStatusesCommandHandler,
	SyncGameClassificationsCommandHandler,
	SyncGamesCommandHandler,
	SyncGenresCommandHandler,
	SyncPlatformsCommandHandler,
} from "$lib/modules/game-library/commands";
import {
	type ICompanyRepositoryPort,
	type ICompletionStatusRepositoryPort,
	type IGameClassificationRepositoryPort,
	type IGameLibraryFilterHasherPort,
	type IGameLibraryFilterRepositoryPort,
	type IGameRecommendationRecordReadonlyStore,
	type IGameRecommendationRecordWriteStore,
	type IGameRepositoryPort,
	type IGameVectorReadonlyStore,
	type IGameVectorWriteStore,
	type IGenreRepositoryPort,
	type IPlatformRepositoryPort,
	CompanyRepository,
	CompletionStatusRepository,
	GameClassificationRepository,
	GameLibraryFilterHasher,
	GameLibraryFilterRepository,
	GameRepository,
	GenreRepository,
	PlatformRepository,
} from "$lib/modules/game-library/infra";
import {
	type IGetCompaniesByIdsQueryHandlerPort,
	type IGetCompletionStatusesByIdsQueryHandlerPort,
	type IGetGameClassificationByGameIdQueryHandler,
	type IGetGameClassificationByIdsQueryHandler,
	type IGetGameLibraryFiltersQueryHandlerPort,
	type IGetGamesByIdsQueryHandlerPort,
	type IGetGamesQueryHandlerFilterBuilderPort,
	type IGetGamesQueryHandlerPort,
	type IGetGamesRankedQueryHandlerPort,
	type IGetGenreByIdQueryHandlerPort,
	type IGetGenresByIdsQueryHandlerPort,
	type IGetLatestGameClassificationByGameIdQueryHandler,
	type IGetPlatformsByIdsQueryHandlerPort,
	GetCompaniesByIdsQueryHandler,
	GetCompletionStatusesByIdsQueryHandler,
	GetGameClassificationsByGameIdQueryHandler,
	GetGameClassificationsByIdsQueryHandler,
	GetGameLibraryFiltersQueryHandler,
	GetGamesByIdsQueryHandler,
	GetGamesQueryHandler,
	GetGamesQueryHandlerFilterBuilder,
	GetGamesRankedQueryHandler,
	GetGenresByIdQueryHandler,
	GetGenresByIdsQueryHandler,
	GetLatestGameClassificationsByGameIdQueryHandler,
	GetPlatformsByIdsQueryHandler,
} from "$lib/modules/game-library/queries";
import type { IGameSessionReadonlyStore } from "$lib/modules/game-session/infra";
import type { IClientGameLibraryModulePort } from "./game-library.module.port";

export type ClientGameLibraryModuleDeps = {
	dbSignal: IDBDatabase;
	playAtlasClient: IPlayAtlasClientPort;
	clock: IClockPort;
	syncRunner: ISyncRunnerPort;
	gameSessionReadonlyStore: IGameSessionReadonlyStore;
	gameVectorWriteStore: IGameVectorWriteStore;
	gameVectorReadonlyStore: IGameVectorReadonlyStore;
	gameRecommendationRecordWriteStore: IGameRecommendationRecordWriteStore;
	gameRecommendationRecordReadonlyStore: IGameRecommendationRecordReadonlyStore;
	eventBus: IDomainEventBusPort;
};

export class ClientGameLibraryModule implements IClientGameLibraryModulePort {
	readonly gameMapper: IGameMapperPort;
	readonly gameRepository: IGameRepositoryPort;
	readonly getGamesQueryHandlerFilterBuilder: IGetGamesQueryHandlerFilterBuilderPort;
	readonly getGamesQueryHandler: IGetGamesQueryHandlerPort;
	readonly getGamesByIdsQueryHandler: IGetGamesByIdsQueryHandlerPort;
	readonly getGamesRankedQueryHandler: IGetGamesRankedQueryHandlerPort;
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

	readonly gameLibraryFilterMapper: IGameLibraryFilterMapperPort;
	readonly gameLibraryFilterRepository: IGameLibraryFilterRepositoryPort;
	readonly gameLibraryFilterHasher: IGameLibraryFilterHasherPort;
	readonly createGameLibraryFilterCommandHandler: ICreateGameLibraryCommandHandler;
	readonly getGameLibraryFiltersQueryHandler: IGetGameLibraryFiltersQueryHandlerPort;

	// #region: Scoring engine
	readonly gameClassificationMapper: IGameClassificationMapperPort;
	readonly gameClassificationRepository: IGameClassificationRepositoryPort;
	readonly getGameClassificationsByIdsQueryHandler: IGetGameClassificationByIdsQueryHandler;
	readonly getGameClassificationsByGameIdQueryHandler: IGetGameClassificationByGameIdQueryHandler;
	readonly getLatestGameClassificationByGameIdQueryHandler: IGetLatestGameClassificationByGameIdQueryHandler;
	readonly syncGameClassificationsCommandHandler: ISyncGameClassificationsCommandHandlerPort;
	readonly syncGameClassificationsFlow: ISyncGameClassificationsFlowPort;
	// #endregion

	// #region: Recommendation Engine
	readonly gameVectorProjectionService: IGameVectorProjectionServicePort;
	readonly gameVectorProjectionWriter: IGameVectorProjectionWriterPort;
	readonly gameRecommendationRecordProjectionService: IGameRecommendationRecordProjectionServicePort;
	readonly gameRecommendationRecordProjectionWriter: IGameRecommendationRecordProjectionWriterPort;
	readonly instancePreferenceModelService: IInstancePreferenceModelService;
	readonly recommendationEngine: IRecommendationEnginePort;
	// #endregion

	constructor({
		dbSignal,
		playAtlasClient,
		clock,
		syncRunner,
		gameSessionReadonlyStore,
		gameVectorReadonlyStore,
		gameRecommendationRecordWriteStore,
		gameRecommendationRecordReadonlyStore,
		gameVectorWriteStore,
		eventBus,
	}: ClientGameLibraryModuleDeps) {
		// #region: Recommendation Engine
		this.gameVectorProjectionService = new GameVectorProjectionService({
			gameVectorReadonlyStore,
		});
		this.gameVectorProjectionWriter = new GameVectorProjectionWriter({
			gameVectorWriteStore,
		});
		this.gameRecommendationRecordProjectionService = new GameRecommendationRecordProjectionService({
			gameRecommendationRecordReadonlyStore,
		});
		this.gameRecommendationRecordProjectionWriter = new GameRecommendationRecordProjectionWriter({
			gameRecommendationRecordReadonlyStore,
			gameRecommendationRecordWriteStore,
			gameVectorProjectionService: this.gameVectorProjectionService,
		});
		this.instancePreferenceModelService = new InstancePreferenceModelService({
			clock,
			gameSessionReadonlyStore,
			gameVectorProjectionService: this.gameVectorProjectionService,
		});
		this.recommendationEngine = new RecommendationEngine({
			gameVectorProjectionService: this.gameVectorProjectionService,
			instancePreferenceModelService: this.instancePreferenceModelService,
		});
		// #endregion

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
		this.getGamesRankedQueryHandler = new GetGamesRankedQueryHandler({
			gameRepository: this.gameRepository,
			recommendationEngine: this.recommendationEngine,
			gameVectorProjectionService: this.gameVectorProjectionService,
		});
		this.syncGamesCommandHandler = new SyncGamesCommandHandler({
			gameRepository: this.gameRepository,
		});
		this.syncGamesFlow = new SyncGamesFlow({
			gameMapper: this.gameMapper,
			playAtlasClient,
			syncGamesCommandHandler: this.syncGamesCommandHandler,
			syncRunner,
			eventBus,
			clock,
			gameRecommendationRecordProjectionWriter: this.gameRecommendationRecordProjectionWriter,
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
			playAtlasClient,
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
			playAtlasClient,
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
			playAtlasClient,
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
			playAtlasClient,
			syncCompletionStatusesCommandHandler: this.syncCompletionStatusesCommandHandler,
			syncRunner,
		});

		// #region: Scoring Engine
		this.gameClassificationMapper = new GameClassificationMapper({ clock });
		this.gameClassificationRepository = new GameClassificationRepository({
			dbSignal,
			gameClassificationMapper: this.gameClassificationMapper,
		});
		this.getGameClassificationsByIdsQueryHandler = new GetGameClassificationsByIdsQueryHandler({
			gameClassificationRepository: this.gameClassificationRepository,
		});
		this.getGameClassificationsByGameIdQueryHandler =
			new GetGameClassificationsByGameIdQueryHandler({
				gameClassificationRepository: this.gameClassificationRepository,
			});
		this.getLatestGameClassificationByGameIdQueryHandler =
			new GetLatestGameClassificationsByGameIdQueryHandler({
				gameClassificationRepository: this.gameClassificationRepository,
			});
		this.syncGameClassificationsCommandHandler = new SyncGameClassificationsCommandHandler({
			gameClassificationsRepository: this.gameClassificationRepository,
		});
		this.syncGameClassificationsFlow = new SyncGameClassificationsFlow({
			gameClassificationMapper: this.gameClassificationMapper,
			playAtlasClient,
			syncGameClassificationsCommandHandler: this.syncGameClassificationsCommandHandler,
			syncRunner,
			gameVectorProjectionWriter: this.gameVectorProjectionWriter,
			gameVectorProjectionService: this.gameVectorProjectionService,
			instancePreferenceModelService: this.instancePreferenceModelService,
			gameRecommendationRecordProjectionService: this.gameRecommendationRecordProjectionService,
			gameRecommendationRecordProjectionWriter: this.gameRecommendationRecordProjectionWriter,
			eventBus,
			clock,
		});
		// #endregion

		// #region: Game Library Filters
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
		// #endregion
	}

	initializeAsync: IClientGameLibraryModulePort["initializeAsync"] = async () => {
		await this.gameVectorProjectionService.initializeAsync();
		await this.instancePreferenceModelService.initializeAsync();
		await this.gameRecommendationRecordProjectionService.initializeAsync();
	};
}
