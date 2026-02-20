import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / CONSTANTLY_CHANGING_BUILD_ITEMS", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(
		RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.CONSTANTLY_CHANGING_BUILD_ITEMS,
	);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"habilidades que mudam constantemente",
		"armas em constante mudança",
		"equipamentos que sempre mudam",
	];

	const shouldNotMatch = [
		"aquela pessoa está em constante mudança",
		"o sistema muda constantemente",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
