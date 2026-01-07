import type { DomainEventBus, LogService } from "@playatlas/common/application";
import { type EnvServiceDeps } from "@playatlas/system/infra";
import { type PlayAtlasApiAuth } from "./bootstrap.auth";
import { type PlayAtlasApiConfig } from "./bootstrap.config";
import { type PlayAtlasApiGameLibrary } from "./bootstrap.game-library";
import { type PlayAtlasApiGameSession } from "./bootstrap.game-session";
import { type PlayAtlasApiInfra } from "./bootstrap.infra";
import { type PlayAtlasApiPlayniteIntegration } from "./bootstrap.playnite-integration";

export type PlayAtlasApi = {
  /**
   * UNSAFE — low-level access intended for testing and infrastructure only.
   *
   * @deprecated Do not use in application code. Intended for tests/bootstrap only.
   */
  unsafe: {
    infra: PlayAtlasApiInfra;
  };
  config: PlayAtlasApiConfig;
  gameLibrary: PlayAtlasApiGameLibrary;
  auth: PlayAtlasApiAuth;
  playniteIntegration: PlayAtlasApiPlayniteIntegration;
  gameSession: PlayAtlasApiGameSession;
  getLogService: () => LogService;
  eventBus: DomainEventBus;
};

export type BootstrapDeps = {
  env: EnvServiceDeps["env"];
};
