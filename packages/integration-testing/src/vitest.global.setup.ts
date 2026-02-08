import { join } from "path";
import { buildTestCompositionRoot } from "./test.lib";

export const root = buildTestCompositionRoot();

export const api = await root.buildAsync();

export const factory = root.getFactory();

export const fixturesDirPath = join(import.meta.dirname, "/fixtures");

export default function teardown() {
	return async () => {
		await root.cleanup();
	};
}
