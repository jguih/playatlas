import type { ILogServicePort } from "@playatlas/common/application";
import type { IGameRepositoryPort } from "@playatlas/game-library/infra";
import type { IPlayniteMediaFilesHandlerPort } from "../infra";
import type { ILibraryManifestServicePort } from "./library-manifest.service.port";

export type PlayniteSyncServiceDeps = {
  playniteMediaFilesHandler: IPlayniteMediaFilesHandlerPort;
  gameRepository: IGameRepositoryPort;
  logService: ILogServicePort;
  libraryManifestService: ILibraryManifestServicePort;
};
