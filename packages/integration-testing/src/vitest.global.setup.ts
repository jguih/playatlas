import { makeTestCompositionRoot } from "@playatlas/bootstrap/testing";
import { join } from "path";

export const root = makeTestCompositionRoot({
  env: {
    PLAYATLAS_LOG_LEVEL: process.env.PLAYATLAS_LOG_LEVEL,
    PLAYATLAS_MIGRATIONS_DIR: process.env.PLAYATLAS_MIGRATIONS_DIR,
    PLAYATLAS_USE_IN_MEMORY_DB: process.env.PLAYATLAS_USE_IN_MEMORY_DB,
    PLAYATLAS_WORK_DIR: process.env.PLAYATLAS_WORK_DIR,
  },
});
export const factory = root.factory;

export const api = await root.buildAsync();

export const fixturesDirPath = join(import.meta.dirname, "/fixtures");

export default function teardown() {
  return async () => {
    await root.cleanup();
  };
}
