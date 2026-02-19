import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / RANDOM_WORLDS", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.RANDOM_WORLDS);
	const re = new RegExp(source, "i");

	const shouldMatch = ["fases aleatórias", "níveis aleatórios", "mapas aleatórios"];

	const shouldNotMatch = ["situações aleatórias", "pessoas aleatórias"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
