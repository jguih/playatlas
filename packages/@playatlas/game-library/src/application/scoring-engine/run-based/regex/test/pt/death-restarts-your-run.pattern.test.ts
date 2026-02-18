import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / DEATH_RESTARTS_YOUR_RUN", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.DEATH_RESTARTS_YOUR_RUN;

	const shouldMatch = [
		"a morte reinicia a sua run",
		"a morte reinicia o seu ciclo",
		"a falha reinicia sua run",
	];

	const shouldNotMatch = ["a morte é inevitável"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
