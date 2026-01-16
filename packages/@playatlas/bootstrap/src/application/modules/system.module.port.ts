import type { ISystemConfigPort } from "@playatlas/common/infra";
import type { IEnvironmentServicePort } from "@playatlas/system/infra";

export type ISystemModulePort = Readonly<{
	getEnvService: () => IEnvironmentServicePort;
	getSystemConfig: () => ISystemConfigPort;
}>;
