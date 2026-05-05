import { beforeEach } from "vitest";
import { testApi } from "./vitest.global.setup";

beforeEach(async () => {
	await testApi.resetDbAsync();
});
