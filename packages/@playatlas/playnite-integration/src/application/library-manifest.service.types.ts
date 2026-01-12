import type {
  IFileSystemServicePort,
  ILogServicePort,
} from "@playatlas/common/application";
import type { IGameRepositoryPort } from "@playatlas/game-library/infra";
import type { SystemConfig } from "@playatlas/system/infra";

export type LibraryManifestServiceDeps = {
  systemConfig: SystemConfig;
  logService: ILogServicePort;
  fileSystemService: IFileSystemServicePort;
  gameRepository: IGameRepositoryPort;
};
