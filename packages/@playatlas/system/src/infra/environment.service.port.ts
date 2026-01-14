export type IEnvironmentServicePort = {
	getWorkDir: () => string;
	getMigrationsDir: () => string | null;
	getLogLevel: () => number | null;
	getUseInMemoryDb: () => boolean;
};
