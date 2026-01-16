import type { LogLevelNumber } from "../application";

export type ISystemConfigPort = {
	getMigrationsDir(): string;
	getLogLevel(): LogLevelNumber;
	getDataDir(): string;
	getTmpDir(): string;
	getMediaFilesRootDirPath(): string;
	getDbPath(): string;
	getSecurityDir(): string;
	getLibraryManifestFilePath(): string;
};
