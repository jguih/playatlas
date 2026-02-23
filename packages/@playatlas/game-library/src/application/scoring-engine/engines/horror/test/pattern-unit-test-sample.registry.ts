import type { PatternUnitTestSampleScoreEngineRegistry } from "../../../test/pattern-unit-test-sample.types";
import { horrorPatternUniTestSampleEN } from "./en.pattern.unit-test-sample";
import { horrorPatternUniTestSamplePT } from "./pt.pattern.unit-test-sample";

export const horrorEnginePatternUnitTestSampleRegistry = {
	en: horrorPatternUniTestSampleEN,
	pt: horrorPatternUniTestSamplePT,
} as const satisfies PatternUnitTestSampleScoreEngineRegistry;
