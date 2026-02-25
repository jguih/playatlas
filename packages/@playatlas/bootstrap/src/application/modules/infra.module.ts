import type { ILogServiceFactoryPort } from "@playatlas/common/application";
import type { ISystemConfigPort } from "@playatlas/common/infra";
import { makeSignatureService } from "@playatlas/system/application";
import { InvalidServerConfigurationError } from "@playatlas/system/domain";
import {
	initDatabase,
	makeDatabaseConnection,
	makeFileSystemService,
	type IEnvironmentServicePort,
} from "@playatlas/system/infra";
import type { DatabaseSync } from "node:sqlite";
import type { IInfraModulePort } from "./infra.module.port";

export type InfraModuleDeps = {
	logServiceFactory: ILogServiceFactoryPort;
	envService: IEnvironmentServicePort;
	systemConfig: ISystemConfigPort;
};

export const makeInfraModule = ({
	logServiceFactory,
	envService,
	systemConfig,
}: InfraModuleDeps): IInfraModulePort => {
	const logService = logServiceFactory.build("Infra");
	const fs = makeFileSystemService();
	const signatureService = makeSignatureService({
		fileSystemService: fs,
		getSecurityDir: systemConfig.getSecurityDir,
		logService: logServiceFactory.build("SignatureService"),
	});

	let _db: DatabaseSync | null = null;

	const infra: IInfraModulePort = {
		getFsService: () => fs,
		getSignatureService: () => signatureService,
		getDb: () => {
			if (!_db) throw new InvalidServerConfigurationError(`Database not initialized`);
			return _db;
		},
		setDb: (db) => (_db = db),
		initDb: () => {
			if (envService.getUseInMemoryDb()) logService.warning("Using in memory database");

			_db = envService.getUseInMemoryDb()
				? makeDatabaseConnection({ inMemory: true })
				: makeDatabaseConnection({ path: systemConfig.getDbPath() });

			return initDatabase({
				db: _db,
				fileSystemService: fs,
				logService: logServiceFactory.build("InitDatabase"),
				migrationsDir: systemConfig.getMigrationsDir(),
			});
		},
		initEnvironment: async () => {
			if (!fs.isDir(systemConfig.getMigrationsDir()))
				throw new InvalidServerConfigurationError(
					`Migrations folder (${systemConfig.getMigrationsDir()}) is not a valid directory`,
				);

			const dirs = [
				systemConfig.getDataDir(),
				systemConfig.getTmpDir(),
				systemConfig.getMediaFilesRootDirPath(),
				systemConfig.getSecurityDir(),
			];

			try {
				for (const dir of dirs) {
					await fs.mkdir(dir, { recursive: true, mode: 0o755 });
				}
			} catch (error) {
				throw new InvalidServerConfigurationError(
					"Failed to create required environment directories",
					error,
				);
			}

			try {
				await signatureService.generateAsymmetricKeyPair();
			} catch (error) {
				throw new InvalidServerConfigurationError("Failed to generate asymmetric key pair", error);
			}
		},
	};
	return Object.freeze(infra);
};
