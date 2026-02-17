import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { PATTERN } from "../../pt.pattern.dict";

describe("Portuguese / RUN_REPETITION_PATTERN", () => {
	const re = PATTERN.RUN_REPETITION;

	const shouldMatch = [
		"a cada partida",
		"a cada ciclo único",
		"a cada nova partida",
		"a cada sessão",
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
