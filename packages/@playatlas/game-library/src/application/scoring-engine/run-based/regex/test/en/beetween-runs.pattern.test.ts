import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN } from "../../en.pattern.dict";

describe("English / BETWEEN_RUNS", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN.BETWEEN_RUNS;

	const shouldMatch = ["between runs", "between cycles", "between sessions"];

	const shouldNotMatch = ["between intervals", "between earth and the sun"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
