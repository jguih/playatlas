import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / ENDLESS_WAYS_TO_COMBINE_BUILD_ITEMS", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(
		RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.ENDLESS_WAYS_TO_COMBINE_BUILD_ITEMS,
	);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"maneiras praticamente ilimitadas de combinar suas habilidades",
		"formas ilimitadas de combinar seus poderes",
		"maneiras sem limites de combinar seus equipamentos",
		"formas ilimitadas de combinar sinergias",
		"maneiras sem limites de combinar suas sinergias",
		"maneiras sem limites de combinar seus feitiços",
		"formas ilimitadas de combinar encantamentos",
		"formas ilimitadas de combinar estilos de jogo",
		"formas ilimitadas de combinar estilos de gameplay",
		"maneiras ilimitadas de combinar estrategias",
		"maneiras infinitas de combinar estrategias",
		"maneiras infinitas de criar estrategias",
		"infinitas maneiras de combinar sinergias",
		"dezenas de formas diferentes de combinar estratégias",
		"milhares de maneiras distintas de combinar estilos de jogo",
		"centenas de jeitos distintos de montar estratégias",
		"centenas de jeitos distintos de criar estratégias",
		"milhares de formas diferentes de criar sinergias",
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
