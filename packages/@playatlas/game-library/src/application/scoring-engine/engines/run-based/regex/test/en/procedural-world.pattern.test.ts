import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN } from "../../en.pattern.dictionary";

describe("English / PROCEDURAL_WORLD", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN.PROCEDURAL_WORLD);
	const re = new RegExp(source, "i");

	const shouldMatch = ["procedural world", "procedural map", "procedural dungeon"];

	const shouldNotMatch = [
		"procedural editor",
		"procedurally generated dungeon",
		"procedural solution",
		"procedural algorithm",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
