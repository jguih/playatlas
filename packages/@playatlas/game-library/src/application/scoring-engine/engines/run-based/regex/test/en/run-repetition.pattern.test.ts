import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN } from "../../en.pattern.dictionary";

describe("English / RUN_REPETITION", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN.RUN_REPETITION);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"every run",
		"every journey",
		"each journey",
		"each session",
		"each playthrough",
		"each new cycle",
		"every new adventure",
		"every subsequent cycle",
	];

	const shouldNotMatch = [
		"a cada inimigo",
		"em cada fase da história",
		"outra arma",
		"cada personagem é único",
		"every runner",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
