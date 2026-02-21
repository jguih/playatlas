import type { ClassificationId } from "@playatlas/common/domain";
import { horrorEnginePatternUnitTestSampleRegistry } from "../engines/horror/test/pattern-unit-test-sample.registry";
import { runBasedEnginePatternUnitTestSampleRegistry } from "../engines/run-based/test/pattern-unit-test-sample.registry";
import type { PatternUnitTestSampleScoreEngineRegistry } from "./pattern-unit-test-sample.types";

export const patternUnitTestSampleRegistry = {
	"RUN-BASED": runBasedEnginePatternUnitTestSampleRegistry,
	HORROR: horrorEnginePatternUnitTestSampleRegistry,
	SURVIVAL: horrorEnginePatternUnitTestSampleRegistry,
} as const satisfies Record<ClassificationId, PatternUnitTestSampleScoreEngineRegistry>;
