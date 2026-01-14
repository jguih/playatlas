import type { IEnvironmentServicePort, SystemConfig } from "@playatlas/system/infra";

export type ISystemModulePort = Readonly<{
	getEnvService: () => IEnvironmentServicePort;
	getSystemConfig: () => SystemConfig;
}>;
