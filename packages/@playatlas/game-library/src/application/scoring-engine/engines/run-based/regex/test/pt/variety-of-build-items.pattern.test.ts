import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / VARIETY_OF_BUILD_ITEMS", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.VARIETY_OF_BUILD_ITEMS;

	const shouldMatch = [
		"variedade de itens",
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
