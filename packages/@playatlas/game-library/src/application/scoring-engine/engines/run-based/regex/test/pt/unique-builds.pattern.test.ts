import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / UNIQUE_BUILDS", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.UNIQUE_BUILDS);
	const re = new RegExp(source, "i");

	// 'configurações' is rare outside of hardware or graphic settings context, but Shape of Dreams use it when referring to builds
	const shouldMatch = [
		"builds únicas",
		"configurações únicas",
		"configurações poderosas",
		"build diferente",
		"builds diferente",
		"diferentes builds",
		"variedade de builds",
		"centenas de builds diferentes",
		"dezenas de builds únicas",
		"dezenas de builds distintas",
	];

	const shouldNotMatch = [
		"configurações diferentes",
		"diferentes configurações gráficas",
		"diferentes configurações de hardware",
		"configurações avançadas",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
