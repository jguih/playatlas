import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / VARIETY_OF_BUILD_ITEMS", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(
		RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.VARIETY_OF_BUILD_ITEMS,
	);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"diversidade de habilidades",
		"diversas habilidades",
		"vários equipamentos",
		"variedade de armas",
		"diversas melhorias",
	];

	const shouldNotMatch = ["vários sistemas", "diversos computadores"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
