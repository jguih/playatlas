export type IEnvironmentServicePort = {
	getDataDir: () => string;
	getMigrationsDir: () => string | null;
	getLogLevel: () => number | null;
	getUseInMemoryDb: () => boolean;
};
