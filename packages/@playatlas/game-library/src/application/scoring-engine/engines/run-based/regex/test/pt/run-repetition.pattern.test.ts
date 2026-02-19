import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / RUN_REPETITION", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.RUN_REPETITION);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"a cada partida",
		"a cada ciclo único",
		"a cada nova partida",
		"a cada sessão",
		"a cada nova run",
		"a cada nova tentativa",
		"a cada novo ciclo",
		"a cada nova sessão",
		"a cada próxima run",
		"entre sessões",
		"em cada ciclo",
		"por cada run",
		"outra tentativa",
	];

	const shouldNotMatch = [
		"a cada inimigo",
		"em cada fase da história",
		"outra arma",
		"cada personagem é único",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
