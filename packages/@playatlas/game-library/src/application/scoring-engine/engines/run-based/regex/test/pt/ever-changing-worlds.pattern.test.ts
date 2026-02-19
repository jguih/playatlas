import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / EVER_CHANGING_WORLDS", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.EVER_CHANGING_WORLDS);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"fases em constante mudança",
		"fases que estão em constante mudança",
		"mundo sempre mudando",
		"mundo que está sempre mudando",
		"mapa que sempre muda",
		"dungeon em constante mudança",
		"fase que muda constantemente",
	];

	const shouldNotMatch = ["aquela pessoa está em contante mudança", "pessoas que sempre muda"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
