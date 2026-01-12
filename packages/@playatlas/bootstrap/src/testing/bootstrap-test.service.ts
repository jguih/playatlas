import type { PlayAtlasApiV1 } from "../application/bootstrap.service.types";
import {
  bootstrapTestFactories,
  type PlayAtlasTestApiFactories,
} from "./bootstrap-test.factory";
import type { BootstrapTestDeps } from "./bootstrap-test.service.types";

export type PlayAtlasTestApi = {
  api: PlayAtlasApiV1;
  factory: PlayAtlasTestApiFactories;
  /**
   * Close the current database connection and create a new in-memory one.
   * Used mostly for `integration testing`.
   */
  resetDbToMemory: () => Promise<void>;
};

export const bootstrapTest = ({ api }: BootstrapTestDeps): PlayAtlasTestApi => {
  const factory = bootstrapTestFactories();

  return {
    api,
    factory,
    resetDbToMemory: async () => {
      api.unsafe.infra.getDb().close();
      await api.unsafe.infra.initDb();
    },
  };
};
