import { beforeEach } from "vitest";
import { root } from "./vitest.global.setup";

beforeEach(async () => {
	await root.resetDbAsync();
});
