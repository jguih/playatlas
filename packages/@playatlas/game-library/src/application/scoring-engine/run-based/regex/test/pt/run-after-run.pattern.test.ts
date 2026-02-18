import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / RUN_AFTER_RUN_PATTERN", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.RUN_AFTER_RUN;

	const shouldMatch = ["partida após partida", "ciclo após ciclo", "sessão após sessão"];

	const shouldNotMatch = ["a cada partida"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
