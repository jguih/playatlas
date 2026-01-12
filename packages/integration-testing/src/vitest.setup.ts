import { PlayAtlasApi } from "@playatlas/bootstrap/application";
import {
  ITestFactoryModulePort,
  makeTestCompositionRoot,
  TestRoot,
} from "@playatlas/bootstrap/testing";
import { tmpdir } from "os";
import { join } from "path";

export let root: TestRoot;
export let factory: ITestFactoryModulePort;
export let api: PlayAtlasApi;

beforeEach(async () => {
  const tmpDir = join(tmpdir(), `${crypto.randomUUID()}-playatlas`);
  root = makeTestCompositionRoot({
    env: {
      PLAYATLAS_LOG_LEVEL: process.env.PLAYATLAS_LOG_LEVEL,
      PLAYATLAS_MIGRATIONS_DIR: process.env.PLAYATLAS_MIGRATIONS_DIR,
      PLAYATLAS_USE_IN_MEMORY_DB: process.env.PLAYATLAS_USE_IN_MEMORY_DB,
      PLAYATLAS_WORK_DIR: tmpDir,
    },
  });
  factory = root.factory;
  api = await root.buildAsync();
});

afterEach(async () => {
  await root.cleanup();
});
