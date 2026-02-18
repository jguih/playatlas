import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / RANDOMLY_CREATED_WORLDS", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.RANDOMLY_CREATED_WORLDS;

	const shouldMatch = [
		"mapas gerados aleatoriamente",
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
