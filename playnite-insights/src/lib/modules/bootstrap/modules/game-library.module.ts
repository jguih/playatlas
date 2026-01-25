import type { IHttpClientPort } from "$lib/modules/common/application";
import type { IClockPort } from "$lib/modules/common/application/clock.port";
import {
	type ICompletionStatusMapperPort,
	type IGameLibrarySyncManagerPort,
	type IGameLibrarySyncStatePort,
	type IGameMapperPort,
	type IPlayAtlasClientPort,
	type ISyncCompletionStatusesFlowPort,
	type ISyncGamesFlowPort,
	CompletionStatusMapper,
	GameLibrarySyncManager,
	GameMapper,
	PlayAtlasClient,
	SyncCompletionStatusesFlow,
	SyncGamesFlow,
} from "$lib/modules/game-library/application";
import {
	type ISyncCompaniesCommandHandlerPort,
	type ISyncCompletionStatusesCommandHandlerPort,
	type ISyncGamesCommandHandlerPort,
	type ISyncGenresCommandHandlerPort,
	type ISyncPlatformsCommandHandlerPort,
	SyncCompaniesCommandHandler,
	SyncCompletionStatusesCommandHandler,
	SyncGamesCommandHandler,
	SyncGenresCommandHandler,
	SyncPlatformsCommandHandler,
} from "$lib/modules/game-library/commands";
import {
	type ICompanyRepositoryPort,
	type ICompletionStatusRepositoryPort,
	type IGameRepositoryPort,
	type IGenreRepositoryPort,
	type IPlatformRepositoryPort,
	CompanyRepository,
	CompletionStatusRepository,
	GameRepository,
	GenreRepository,
	PlatformRepository,
} from "$lib/modules/game-library/infra";
import { GameLibrarySyncState } from "$lib/modules/game-library/infra/game-library-sync-state";
import {
	type IGetCompaniesByIdsQueryHandlerPort,
	type IGetCompletionStatusesByIdsQueryHandlerPort,
	type IGetGamesByIdsQueryHandlerPort,
	type IGetGamesQueryHandlerPort,
	type IGetGenreByIdQueryHandlerPort,
	type IGetGenresByIdsQueryHandlerPort,
	type IGetPlatformsByIdsQueryHandlerPort,
	GetCompaniesByIdsQueryHandler,
	GetCompletionStatusesByIdsQueryHandler,
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
	readonly gameMapper: IGameMapperPort;
	readonly gameRepository: IGameRepositoryPort;
	readonly getGamesQueryHandler: IGetGamesQueryHandlerPort;
	readonly getGamesByIdsQueryHandler: IGetGamesByIdsQueryHandlerPort;
	readonly syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	readonly syncGamesFlow: ISyncGamesFlowPort;

	readonly genreRepository: IGenreRepositoryPort;
	readonly getGenreByIdQueryHandler: IGetGenreByIdQueryHandlerPort;
	readonly getGenresByIdsQueryHandler: IGetGenresByIdsQueryHandlerPort;
	readonly syncGenresCommandHandler: ISyncGenresCommandHandlerPort;

	readonly companyRepository: ICompanyRepositoryPort;
	readonly getCompaniesByIdsQueryHandler: IGetCompaniesByIdsQueryHandlerPort;
	readonly syncCompaniesCommandHandler: ISyncCompaniesCommandHandlerPort;

	readonly platformRepository: IPlatformRepositoryPort;
	readonly getPlatformsByIdsQueryHandler: IGetPlatformsByIdsQueryHandlerPort;
	readonly syncPlatformsCommandHandler: ISyncPlatformsCommandHandlerPort;

	readonly completionStatusMapper: ICompletionStatusMapperPort;
	readonly completionStatusRepository: ICompletionStatusRepositoryPort;
	readonly getCompletionStatusesByIdsQueryHandler: IGetCompletionStatusesByIdsQueryHandlerPort;
	readonly syncCompletionStatusesCommandHandler: ISyncCompletionStatusesCommandHandlerPort;
	readonly syncCompletionStatusesFlow: ISyncCompletionStatusesFlowPort;

	readonly playAtlasClient: IPlayAtlasClientPort;
	readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	readonly gameLibrarySyncManager: IGameLibrarySyncManagerPort;

	constructor({ dbSignal, httpClient, clock }: ClientGameLibraryModuleDeps) {
		this.playAtlasClient = new PlayAtlasClient({ httpClient });
		this.gameLibrarySyncState = new GameLibrarySyncState();

		this.gameMapper = new GameMapper({ clock });
		this.gameRepository = new GameRepository({ dbSignal });
		this.getGamesQueryHandler = new GetGamesQueryHandler({ gameRepository: this.gameRepository });
		this.getGamesByIdsQueryHandler = new GetGamesByIdsQueryHandler({
			gameRepository: this.gameRepository,
		});
		this.syncGamesCommandHandler = new SyncGamesCommandHandler({
			gameRepository: this.gameRepository,
		});
		this.syncGamesFlow = new SyncGamesFlow({
			clock,
			gameLibrarySyncState: this.gameLibrarySyncState,
			gameMapper: this.gameMapper,
			playAtlasClient: this.playAtlasClient,
			syncGamesCommandHandler: this.syncGamesCommandHandler,
		});

		this.genreRepository = new GenreRepository({ dbSignal });
		this.getGenreByIdQueryHandler = new GetGenresByIdQueryHandler({
			genreRepository: this.genreRepository,
		});
		this.getGenresByIdsQueryHandler = new GetGenresByIdsQueryHandler({
			genreRepository: this.genreRepository,
		});
		this.syncGenresCommandHandler = new SyncGenresCommandHandler({
			genreRepository: this.genreRepository,
		});

		this.companyRepository = new CompanyRepository({ dbSignal });
		this.getCompaniesByIdsQueryHandler = new GetCompaniesByIdsQueryHandler({
			companyRepository: this.companyRepository,
		});
		this.syncCompaniesCommandHandler = new SyncCompaniesCommandHandler({
			companyRepository: this.companyRepository,
		});

		this.platformRepository = new PlatformRepository({ dbSignal });
		this.getPlatformsByIdsQueryHandler = new GetPlatformsByIdsQueryHandler({
			platformRepository: this.platformRepository,
		});
		this.syncPlatformsCommandHandler = new SyncPlatformsCommandHandler({
			platformRepository: this.platformRepository,
		});

		this.completionStatusMapper = new CompletionStatusMapper({ clock });
		this.completionStatusRepository = new CompletionStatusRepository({ dbSignal });
		this.getCompletionStatusesByIdsQueryHandler = new GetCompletionStatusesByIdsQueryHandler({
			completionStatusRepository: this.completionStatusRepository,
		});
		this.syncCompletionStatusesCommandHandler = new SyncCompletionStatusesCommandHandler({
			completionStatusRepository: this.completionStatusRepository,
		});
		this.syncCompletionStatusesFlow = new SyncCompletionStatusesFlow({
			clock,
			gameLibrarySyncState: this.gameLibrarySyncState,
			completionStatusMapper: this.completionStatusMapper,
			playAtlasClient: this.playAtlasClient,
			syncCompletionStatusesCommandHandler: this.syncCompletionStatusesCommandHandler,
		});

		this.gameLibrarySyncManager = new GameLibrarySyncManager({
			syncCompletionStatusesFlow: this.syncCompletionStatusesFlow,
			syncGamesFlow: this.syncGamesFlow,
			clock,
		});
	}
}
