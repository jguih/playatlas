import type { IFileSystemServicePort, ILogServicePort } from "@playatlas/common/application";
import type { ISystemConfigPort } from "@playatlas/common/infra";
import type { IGameRepositoryPort } from "@playatlas/game-library/infra";

export type LibraryManifestServiceDeps = {
	systemConfig: ISystemConfigPort;
	logService: ILogServicePort;
	fileSystemService: IFileSystemServicePort;
	gameRepository: IGameRepositoryPort;
};
