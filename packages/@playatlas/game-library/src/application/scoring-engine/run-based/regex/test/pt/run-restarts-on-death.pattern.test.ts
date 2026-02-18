import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / RUN_RESTARTS_ON_DEATH", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.RUN_RESTARTS_ON_DEATH;

	const shouldMatch = [
		"a run reinicia ao morrer",
		"a sessão reinicia quando você morrer",
		"a sessão reinicia quando você morre",
	];

	const shouldNotMatch = ["a morte é inevitável"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
