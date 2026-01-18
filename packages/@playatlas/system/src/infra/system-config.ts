import { isValidLogLevel, logLevel } from "@playatlas/common/application";
import type { ISystemConfigPort } from "@playatlas/common/infra";
import { join } from "path";
import { makeLogService } from "../application";
import { type MakeSystemConfigDeps } from "./system-config.types";

export const makeSystemConfig = ({ envService }: MakeSystemConfigDeps): ISystemConfigPort => {
	const logService = makeLogService("SystemConfig", () => 1);

	const _data_dir = join(envService.getWorkDir(), "/data");
	const _tmp_dir = join(_data_dir, "/tmp");
	const _media_files_root_dir_path = join(_data_dir, "/files");
	const _security_dir = join(_data_dir, "/security");
	const _library_manifest_file_path = join(_data_dir, "/manifest.json");

	if (envService.getMigrationsDir())
		logService.warning(
			`Migrations directory is being overwritten by environment to: ${envService.getMigrationsDir()}`,
		);
	const _migrations_dir =
		envService.getMigrationsDir() ?? join(envService.getWorkDir(), "/infra/migrations");

	const envLogLevel = envService.getLogLevel();
	if (!isValidLogLevel(envLogLevel))
		logService.warning(
			`Invalid log level detected: '${envLogLevel}'. Will default to level 1 (info).`,
		);

	const _log_level = isValidLogLevel(envLogLevel) ? envLogLevel : logLevel.info;
	const _db_path = join(_data_dir, "/db.sqlite");

	const systemConfig: ISystemConfigPort = {
		getMigrationsDir: () => _migrations_dir,
		getLogLevel: () => _log_level,
		getDataDir: () => _data_dir,
		getMediaFilesRootDirPath: () => _media_files_root_dir_path,
		getTmpDir: () => _tmp_dir,
		getDbPath: () => _db_path,
		getSecurityDir: () => _security_dir,
		getLibraryManifestFilePath: () => _library_manifest_file_path,
	};
	return Object.freeze(systemConfig);
};

let _config: ISystemConfigPort | null = null;

export const getSystemConfig = (deps: MakeSystemConfigDeps) => {
	if (_config === null) {
		_config = makeSystemConfig(deps);
	}
	return _config;
};
