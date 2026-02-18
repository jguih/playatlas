import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN } from "../../en.pattern.dict";

describe("English / RESTART_AFTER_DEATH", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN.RESTART_AFTER_DEATH;

	const shouldMatch = [
		"forced to restart her journey every time she dies",
		"restart your journey every time you die",
		"restart his journey every time he fails",
		"restart the cycle every time you die",
	];

	const shouldNotMatch = [
		"restart the computer every time it dies",
		"restart the printer each time it doesn't connect",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
