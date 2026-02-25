import type { PatternUnitTestSample } from "../../../test/pattern-unit-test-sample.types";
import {
	HORROR_ENGINE_PATTERN_DICTIONARY_EN as PATTERN,
	type HorrorPatternIdEN,
} from "../regex/en.pattern.dictionary";

export const horrorPatternUniTestSampleEN = {
	PSYCHOLOGICAL_HORROR: {
		pattern: PATTERN.PSYCHOLOGICAL_HORROR,
		shouldMatch: ["psychological horror", "psychological-horror"],
		shouldNotMatch: ["horror movie"],
	},
	HORROR_ADJECTIVES: {
		pattern: PATTERN.HORROR_ADJECTIVES,
		shouldMatch: [
			"dread",
			"eerie",
			"sinister",
			"haunting",
			"terrifying",
			"unsettling",
			"dread-filled",
			"dread filled",
		],
		shouldNotMatch: ["car"],
	},
	HORROR_ATMOSPHERE: {
		pattern: PATTERN.HORROR_ATMOSPHERE,
		shouldMatch: ["eerie atmosphere", "unsettling atmosphere", "terrifying atmosphere"],
		shouldNotMatch: ["Earth's atmosphere", "Jupiter's atmosphere"],
	},
	HORROR_WORLD: {
		pattern: PATTERN.HORROR_WORLD,
		shouldMatch: ["sinister world", "terrifying adventure"],
		shouldNotMatch: ["nice adventure"],
	},
	FIRST_PERSON_SHOOTER: {
		pattern: PATTERN.FIRST_PERSON_SHOOTER,
		shouldMatch: ["first-person shooter", "first person shooter"],
		shouldNotMatch: ["first-time shooter", "first time shooter"],
	},
	THIRD_PERSON_SHOOTER: {
		pattern: PATTERN.THIRD_PERSON_SHOOTER,
		shouldMatch: ["third-person shooter", "third person shooter"],
		shouldNotMatch: ["third-time shooter", "third time shooter"],
	},
	DEMONS_ZOMBIES: {
		pattern: PATTERN.DEMONS_ZOMBIES,
		shouldMatch: ["demon", "demons", "zombie", "zombies"],
		shouldNotMatch: ["angels"],
	},
} as const satisfies PatternUnitTestSample<HorrorPatternIdEN>;
