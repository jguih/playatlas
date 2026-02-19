import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN } from "../../en.pattern.dict";

describe("English / RUN_AFTER_RUN", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN.RUN_AFTER_RUN;

	const shouldMatch = ["run after run", "cycle after cycle", "loop after loop"];

	const shouldNotMatch = ["each run"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
