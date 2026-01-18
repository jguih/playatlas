import {
	type IDomainEventBusPort,
	type IFileSystemServicePort,
	type ILogServiceFactoryPort,
} from "@playatlas/common/application";
import type { IClockPort, ISystemConfigPort } from "@playatlas/common/infra";
import type {
	ICompanyFactoryPort,
	ICompletionStatusFactoryPort,
	IGameFactoryPort,
	IGenreFactoryPort,
	IPlatformFactoryPort,
} from "@playatlas/game-library/application";
import type {
	ICompanyRepositoryPort,
	ICompletionStatusRepositoryPort,
	IGameAssetsContextFactoryPort,
	IGameRepositoryPort,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "@playatlas/game-library/infra";
import {
	makeLibraryManifestService,
	makePlayniteSyncService,
} from "@playatlas/playnite-integration/application";
import { makeSyncGamesCommandHandler } from "@playatlas/playnite-integration/commands";
import {
	makePlayniteMediaFilesContextFactory,
	makePlayniteMediaFilesHandler,
} from "@playatlas/playnite-integration/infra";
import type { IPlayniteIntegrationModulePort } from "./playnite-integration.module.port";

export type PlayniteIntegrationModuleDeps = {
	logServiceFactory: ILogServiceFactoryPort;
	fileSystemService: IFileSystemServicePort;
	systemConfig: ISystemConfigPort;
	gameRepository: IGameRepositoryPort;
	companyRepository: ICompanyRepositoryPort;
	platformRepository: IPlatformRepositoryPort;
	genreRepository: IGenreRepositoryPort;
	completionStatusRepository: ICompletionStatusRepositoryPort;
	eventBus: IDomainEventBusPort;
	gameAssetsContextFactory: IGameAssetsContextFactoryPort;
	clock: IClockPort;
	gameFactory: IGameFactoryPort;
	companyFactory: ICompanyFactoryPort;
	completionStatusFactory: ICompletionStatusFactoryPort;
	platformFactory: IPlatformFactoryPort;
	genreFactory: IGenreFactoryPort;
};

export const makePlayniteIntegrationModule = ({
	logServiceFactory,
	fileSystemService,
	systemConfig,
	gameRepository,
	companyRepository,
	completionStatusRepository,
	genreRepository,
	platformRepository,
	eventBus,
	gameAssetsContextFactory,
	clock,
	gameFactory,
	companyFactory,
	completionStatusFactory,
	platformFactory,
	genreFactory,
}: PlayniteIntegrationModuleDeps): IPlayniteIntegrationModulePort => {
	const buildLog = (ctx: string) => logServiceFactory.build(ctx);

	const playniteMediaFilesContextFactory = makePlayniteMediaFilesContextFactory({
		fileSystemService,
		logServiceFactory,
		systemConfig,
	});
	const playniteMediaFilesHandler = makePlayniteMediaFilesHandler({
		logService: buildLog("PlayniteMediaFilesHandler"),
		fileSystemService,
		gameAssetsContextFactory,
		playniteMediaFilesContextFactory,
	});

	const libraryManifestService = makeLibraryManifestService({
		systemConfig,
		fileSystemService,
		logService: buildLog("LibraryManifestService"),
		gameRepository,
	});
	const playniteSyncService = makePlayniteSyncService({
		gameRepository,
		libraryManifestService,
		logService: buildLog("PlayniteSyncService"),
		playniteMediaFilesHandler,
	});
	const syncGamesCommandHandler = makeSyncGamesCommandHandler({
		companyRepository,
		completionStatusRepository,
		gameRepository,
		genreRepository,
		platformRepository,
		logService: buildLog("SyncGamesCommandHandler"),
		libraryManifestService,
		eventBus,
		clock,
		gameFactory,
		companyFactory,
		completionStatusFactory,
		platformFactory,
		genreFactory,
	});

	const playniteIntegrationApi: IPlayniteIntegrationModulePort = {
		getPlayniteMediaFilesHandler: () => playniteMediaFilesHandler,
		getLibraryManifestService: () => libraryManifestService,
		getPlayniteSyncService: () => playniteSyncService,
		commands: {
			getSyncGamesCommandHandler: () => syncGamesCommandHandler,
		},
		getPlayniteMediaFilesContextFactory: () => playniteMediaFilesContextFactory,
	};
	return Object.freeze(playniteIntegrationApi);
};
