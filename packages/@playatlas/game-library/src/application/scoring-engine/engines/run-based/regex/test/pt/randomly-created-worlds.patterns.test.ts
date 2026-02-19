import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / RANDOMLY_CREATED_WORLDS", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(
		RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.RANDOMLY_CREATED_WORLDS,
	);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"mapas gerados aleatoriamente",
		"mapas gerados randomicamente",
		"mapas gerados de forma randômica",
		"níveis gerados aleatoriamente",
		"fases geradas de maneira aleatória",
	];

	const shouldNotMatch = ["situações são aleatórias", "pessoas que são aleatórias"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
