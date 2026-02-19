import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / RUN_AFTER_RUN", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.RUN_AFTER_RUN);
	const re = new RegExp(source, "i");

	const shouldMatch = ["partida após partida", "ciclo após ciclo", "sessão após sessão"];

	const shouldNotMatch = ["a cada partida"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
