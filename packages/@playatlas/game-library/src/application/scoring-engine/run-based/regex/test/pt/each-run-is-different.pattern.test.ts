import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / EACH_RUN_IS_DIFFERENT", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.EACH_RUN_IS_DIFFERENT;

	const shouldMatch = ["cada partida é diferente", "cada partida é única"];

	const shouldNotMatch = ["toda partida é a mesma"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
