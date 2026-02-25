import type { PatternUnitTestSampleScoreEngineRegistry } from "../../../test/pattern-unit-test-sample.types";
import { runBasedPatternUniTestSampleEN } from "./en.pattern.unit-test-sample";
import { runBasedPatternUniTestSamplePT } from "./pt.pattern.unit-test-sample";

export const runBasedEnginePatternUnitTestSampleRegistry = {
	en: runBasedPatternUniTestSampleEN,
	pt: runBasedPatternUniTestSamplePT,
} as const satisfies PatternUnitTestSampleScoreEngineRegistry;
