import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN } from "../../en.pattern.dictionary";

describe("English / PROCEDURALLY_GENERATED_WORLD_STRONG", () => {
	const dsl = makeScoreEngineDSL();
	const source = dsl.normalizeCompile(
		RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN.PROCEDURALLY_GENERATED_WORLD_STRONG,
	);
	const re = new RegExp(source, "i");

	const shouldMatch = [
		"procedurally created world",
		"procedurally generated map",
		"procedurally created planet",
		"procedurally generated dungeon",
		"the entire map is procedurally generated",
		"all dungeons are generated procedurally",
		"a procedurally generated world",
		"a procedurally generated open world",
		"procedurally generated levels",
		"the world is generated procedurally",
		"each dungeon is procedurally generated",
		"explore procedurally generated planets",
		"features fully procedurally generated maps",
		"maps are created procedurally",
		"every run features a procedurally generated layout",
		"infinite procedurally generated universe",
	];

	const shouldNotMatch = [
		"all dungeon are generated",
		"the world is beautifully generated",
		"the dungeon is carefully created",
		"maps are generated daily",
		"the planet was created by ancient gods",
		"the world is randomly selected",
		"the dungeon is randomly placed",
		"the map is automatically generated",
		"new dungeons are generated every week",
		"the dungeon is massive and filled with enemies. the system was procedurally optimized to generate loot tables.",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
