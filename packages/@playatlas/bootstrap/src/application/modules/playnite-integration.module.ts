import {
	type IDomainEventBusPort,
	type IFileSystemServicePort,
	type ILogServiceFactoryPort,
} from "@playatlas/common/application";
import type { ISystemConfigPort } from "@playatlas/common/infra";
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
}: PlayniteIntegrationModuleDeps): IPlayniteIntegrationModulePort => {
	const _playnite_media_files_context_factory = makePlayniteMediaFilesContextFactory({
		fileSystemService,
		logServiceFactory,
		systemConfig,
	});
	const _playnite_media_files_handler = makePlayniteMediaFilesHandler({
		logService: logServiceFactory.build("PlayniteMediaFilesHandler"),
		fileSystemService,
		gameAssetsContextFactory,
		playniteMediaFilesContextFactory: _playnite_media_files_context_factory,
	});
	const _library_manifest_service = makeLibraryManifestService({
		systemConfig,
		fileSystemService,
		logService: logServiceFactory.build("LibraryManifestService"),
		gameRepository: gameRepository,
	});
	const _playnite_sync_service = makePlayniteSyncService({
		gameRepository: gameRepository,
		libraryManifestService: _library_manifest_service,
		logService: logServiceFactory.build("PlayniteSyncService"),
		playniteMediaFilesHandler: _playnite_media_files_handler,
	});
	const _sync_games_command_handler = makeSyncGamesCommandHandler({
		companyRepository: companyRepository,
		completionStatusRepository: completionStatusRepository,
		gameRepository: gameRepository,
		genreRepository: genreRepository,
		platformRepository: platformRepository,
		logService: logServiceFactory.build("SyncGamesCommandHandler"),
		libraryManifestService: _library_manifest_service,
		eventBus,
	});

	const playniteIntegrationApi: IPlayniteIntegrationModulePort = {
		getPlayniteMediaFilesHandler: () => _playnite_media_files_handler,
		getLibraryManifestService: () => _library_manifest_service,
		getPlayniteSyncService: () => _playnite_sync_service,
		commands: {
			getSyncGamesCommandHandler: () => _sync_games_command_handler,
		},
		getPlayniteMediaFilesContextFactory: () => _playnite_media_files_context_factory,
	};
	return Object.freeze(playniteIntegrationApi);
};
