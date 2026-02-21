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
} as const satisfies PatternUnitTestSample<HorrorPatternIdEN>;
