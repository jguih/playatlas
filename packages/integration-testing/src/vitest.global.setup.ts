import { join } from "path";
import { buildTestCompositionRoot } from "./test.lib";

export const root = buildTestCompositionRoot();

export const { api, testApi } = await root.buildAsync();

export const fixturesDirPath = join(import.meta.dirname, "/fixtures");

export default function teardown() {
	return async () => {
		await testApi.cleanup();
	};
}
