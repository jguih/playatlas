import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / ENEMY_VOLUME_SPECIFIC", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.ENEMY_VOLUME_SPECIFIC;

	const shouldMatch = [
		"450+ inimigos",
		"120 inimigos",
		"mais que 400+ inimigos",
		"mais de 10 inimigos",
	];

	const shouldNotMatch = [
		"120 fases",
		"60 fps",
		"100 níveis",
		"100+ níveis",
		"mais de 200 dungeons",
		"450 jogadores",
		"10 horas de gameplay",
		"itens variados",
		"itens únicos",
		"itens especiais",
		"loot raro",
		"colecione itens",
		"mais de 100 horas de jogo",
		"10% de desconto",
		"versão 1.2",
		"até 4 jogadores",
		"modo 2D",
		"120 colecionáveis",
		"100 cartas",
		"50 armas",
		"200 habilidades",
		"+344 itens",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
