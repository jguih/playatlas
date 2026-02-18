import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN } from "../../en.pattern.dict";

describe("English / DIE_AND_TRY_AGAIN", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN.DIE_AND_TRY_AGAIN;

	const shouldMatch = ["die, try again", "fail and start over", "fail, then try again"];

	const shouldNotMatch = ["he tried to run"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
