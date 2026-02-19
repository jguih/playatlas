import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / NO_RUN_IS_THE_SAME", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.NO_RUN_IS_THE_SAME;

	const shouldMatch = [
		"nenhuma run é igual",
		"nenhuma partida é igual",
		"nenhum ciclo é igual ao outro",
		"nenhuma partida será igual a outra",
		"nenhuma partida é igual à outra",
	];

	const shouldNotMatch = ["a cada partida", "a cada ciclo"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
