import {
  type IFileSystemServicePort,
  type LogServiceFactory,
} from "@playatlas/common/application";
import type {
  ICompanyRepositoryPort,
  ICompletionStatusRepositoryPort,
  IGameRepositoryPort,
  IGenreRepositoryPort,
  IPlatformRepositoryPort,
} from "@playatlas/game-library/infra";
import {
  makeLibraryManifestService,
  makePlayniteSyncService,
} from "@playatlas/playnite-integration/application";
import { makeSyncGamesCommandHandler } from "@playatlas/playnite-integration/commands";
import { makePlayniteMediaFilesHandler } from "@playatlas/playnite-integration/infra";
import type { SystemConfig } from "@playatlas/system/infra";
import type { IPlayniteIntegrationModulePort } from "./playnite-integration.module.port";

export type PlayniteIntegrationModuleDeps = {
  logServiceFactory: LogServiceFactory;
  fileSystemService: IFileSystemServicePort;
  systemConfig: SystemConfig;
  gameRepository: IGameRepositoryPort;
  companyRepository: ICompanyRepositoryPort;
  platformRepository: IPlatformRepositoryPort;
  genreRepository: IGenreRepositoryPort;
  completionStatusRepository: ICompletionStatusRepositoryPort;
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
}: PlayniteIntegrationModuleDeps): IPlayniteIntegrationModulePort => {
  const _playnite_media_files_handler = makePlayniteMediaFilesHandler({
    logService: logServiceFactory.build("PlayniteMediaFilesHandler"),
    logServiceFactory,
    fileSystemService,
    systemConfig,
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
  });

  const playniteIntegrationApi: IPlayniteIntegrationModulePort = {
    getPlayniteMediaFilesHandler: () => _playnite_media_files_handler,
    getLibraryManifestService: () => _library_manifest_service,
    getPlayniteSyncService: () => _playnite_sync_service,
    commands: {
      getSyncGamesCommandHandler: () => _sync_games_command_handler,
    },
  };
  return Object.freeze(playniteIntegrationApi);
};
