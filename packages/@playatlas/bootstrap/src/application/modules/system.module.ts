import {
  type EnvServiceDeps,
  makeEnvService,
  makeSystemConfig,
} from "@playatlas/system/infra";
import { type ISystemModulePort } from "./system.module.port";

export type SystemModuleDeps = EnvServiceDeps;

export const makeSystemModule = ({
  env,
}: SystemModuleDeps): ISystemModulePort => {
  const _env_service = makeEnvService({ env });
  const _system_config = makeSystemConfig({ envService: _env_service });

  const config: ISystemModulePort = {
    getEnvService: () => _env_service,
    getSystemConfig: () => _system_config,
  };
  return Object.freeze(config);
};
