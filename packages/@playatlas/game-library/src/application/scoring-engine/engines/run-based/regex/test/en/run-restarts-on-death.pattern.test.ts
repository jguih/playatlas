import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN } from "../../en.pattern.dictionary";

describe("English / RUN_RESTARTS_ON_DEATH", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN.RUN_RESTARTS_ON_DEATH);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"run restarts on death",
		"session restarts on failure",
		"the playthrough restarts when you die",
		"cycle ends when you die",
	];

	const shouldNotMatch = [
		"he restarted his computer",
		"the computer was restarted",
		"they failed to restart the computer",
		"someone restarted the system after failure",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
