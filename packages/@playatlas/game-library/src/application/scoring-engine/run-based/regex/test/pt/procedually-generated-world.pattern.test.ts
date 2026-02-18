import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / PROCEDURALLY_GENERATED_WORLD", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.PROCEDURALLY_GENERATED_WORLD;

	const shouldMatch = [
		"mundo gerado proceduralmente",
		"mapa gerado proceduralmente",
		"planeta gerado de maneira procedural",
		"planeta gerado de forma procedural",
		"mundo totalmente gerado proceduralmente",
		"mapa aleatoriamente gerado proceduralmente",
		"um planeta inteiro gerado de forma procedural",
		"cada run tem um mapa gerado proceduralmente",
		"a dungeon é gerada de maneira procedural a cada partida",
		"o jogo cria mundos gerados proceduralmente",
		"as dungeons são geradas de maneira procedural",
		"mapa gerado de forma procedural",
	];

	const shouldNotMatch = [
		"o relatório foi gerado proceduralmente pelo sistema",
		"um erro foi gerado proceduralmente",
		"o mapa mostra o mundo inteiro",
		"viajar pelo mundo gera experiências",
		"o mundo muda quando algo é gerado",
		"um mapa aparece quando o arquivo é gerado",
		"código gerado proceduralmente pelo compilador",
		"conteúdo gerado proceduralmente para testes",
		"um mundo de problemas foi gerado",
		"isso gerou um mapa mental",
		"o sistema reinicia quando um erro é gerado",
		"o computador gera um mapa de memória ao reiniciar",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
