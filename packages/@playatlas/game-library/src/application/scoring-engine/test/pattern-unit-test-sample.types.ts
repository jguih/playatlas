import type { ScoreEngineLanguage } from "@playatlas/common/domain";
import type { ScoreEnginePattern } from "../language/engine.lexicon.api";

export type PatternUnitTestSample<TKey extends string> = Record<
	TKey,
	{ pattern: ScoreEnginePattern; shouldMatch: string[]; shouldNotMatch: string[] }
>;

export type PatternUnitTestSampleScoreEngineRegistry<TKey extends string = string> = Record<
	ScoreEngineLanguage,
	PatternUnitTestSample<TKey>
>;
