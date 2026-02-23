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
	UNSETTLING: {
		pattern: PATTERN.UNSETTLING,
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
	UNSETTLING_ATMOSPHERE: {
		pattern: PATTERN.UNSETTLING_ATMOSPHERE,
		shouldMatch: ["eerie atmosphere", "dark atmosphere", "terrifying atmosphere"],
		shouldNotMatch: ["Earth's atmosphere", "Jupiter's atmosphere"],
	},
	UNSETTLING_WORLD_ADVENTURE: {
		pattern: PATTERN.UNSETTLING_WORLD_ADVENTURE,
		shouldMatch: ["sinister world", "terrifying adventure"],
		shouldNotMatch: ["nice adventure"],
	},
} as const satisfies PatternUnitTestSample<HorrorPatternIdEN>;
