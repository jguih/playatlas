import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { PATTERN } from "../../pt.pattern.dict";

describe("Portuguese / EVER_CHANGING_WORLDS", () => {
	const re = PATTERN.EVER_CHANGING_WORLDS;

	const shouldMatch = [
		"fases em constante mudança",
		"mundo sempre mudando",
		"mapa que sempre muda",
		"dungeon em constante mudança",
	];

	const shouldNotMatch = ["aquela pessoa está em contante mudança", "pessoas que sempre muda"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
