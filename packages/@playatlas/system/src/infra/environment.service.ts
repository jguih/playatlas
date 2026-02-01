import { InvalidEnvironmentVariableValueError } from "../domain/error";
import type { IEnvironmentServicePort } from "./environment.service.port";
import type { EnvServiceDeps } from "./environment.service.types";

export const makeEnvService = ({ env }: EnvServiceDeps): IEnvironmentServicePort => {
	const dataDir = env.PLAYATLAS_DATA_DIR;
	if (!dataDir || dataDir === "")
		throw new InvalidEnvironmentVariableValueError(
			`Data directory environment variable is empty or undefined`,
			{ envName: "PLAYATLAS_DATA_DIR" },
		);

	const migrationsDir =
		env.PLAYATLAS_MIGRATIONS_DIR && env.PLAYATLAS_MIGRATIONS_DIR !== ""
			? env.PLAYATLAS_MIGRATIONS_DIR
			: null;
	const logLevel = Number.isInteger(Number(env.PLAYATLAS_LOG_LEVEL))
		? Number(env.PLAYATLAS_LOG_LEVEL)
		: null;
	const useInMemoryDb =
		env.PLAYATLAS_USE_IN_MEMORY_DB === "true" || env.PLAYATLAS_USE_IN_MEMORY_DB === "1";

	return {
		getDataDir: () => dataDir,
		getMigrationsDir: () => migrationsDir,
		getLogLevel: () => logLevel,
		getUseInMemoryDb: () => useInMemoryDb,
	};
};
