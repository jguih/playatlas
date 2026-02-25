import {
	type IDomainEventBusPort,
	type IFileSystemServicePort,
	type ILogServiceFactoryPort,
} from "@playatlas/common/application";
import type { IClockPort, ISystemConfigPort } from "@playatlas/common/infra";
import type { IGameLibraryUnitOfWorkPort } from "@playatlas/game-library/application";
import type {
	IGameAssetsContextFactoryPort,
	IGameRepositoryPort,
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
	eventBus: IDomainEventBusPort;
	gameAssetsContextFactory: IGameAssetsContextFactoryPort;
	clock: IClockPort;
	gameLibraryUnitOfWork: IGameLibraryUnitOfWorkPort;
};

export const makePlayniteIntegrationModule = ({
	logServiceFactory,
	fileSystemService,
	systemConfig,
	gameRepository,
	eventBus,
	gameAssetsContextFactory,
	clock,
	gameLibraryUnitOfWork,
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
		logService: buildLog("SyncGamesCommandHandler"),
		libraryManifestService,
		eventBus,
		clock,
		gameLibraryUnitOfWork,
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
