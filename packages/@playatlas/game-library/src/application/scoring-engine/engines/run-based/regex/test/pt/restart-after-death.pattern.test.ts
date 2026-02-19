import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dictionary";

describe("Portuguese / RESTART_AFTER_DEATH", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.RESTART_AFTER_DEATH);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"recomeçar toda vez que morre",
		"recomece sempre que morrer",
		"reiniciar toda vez que morre",
		"recomeçar toda vez que morrer",
		"recomeçar toda vez que ela morre",
		"recomeçar toda vez que ele morre",
		"reiniciar sempre que morre",
		"recomeçar sempre que falhar",
		"reinicie sempre que falhar",
		"recomeçar sempre que ele falhar",
	];

	const shouldNotMatch = ["reiniciar o computador sempre que morre a bateria"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
