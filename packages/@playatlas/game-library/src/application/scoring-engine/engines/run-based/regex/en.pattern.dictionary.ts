import {
	SCORE_ENGINE_CORE_LEXICON_EN as CORE,
	type ScoreEnginePatternDictionary,
} from "../../../language";
import {
	alternatives,
	filler,
	literal as l,
	sequence,
	word as w,
	window,
} from "../../../language/engine.lexicon.api";
import { RUN_BASED_ENGINE_LEXICON_EN as LEX } from "./en.lexicon";

export const RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN = {
	ROGUELIKE_LITE: w(LEX.ROGUELIKE_LITE),
	RUN_REPETITION: sequence(
		filler(w(CORE.EACH_EVERY), {
			n: 1,
			f: w(alternatives(l("(single\\s+)?new"), l("subsequent"), l("different"))),
		}),
		w(LEX.RUN),
	),
	RUN_AFTER_RUN: sequence(w(LEX.RUN), w(l("after")), w(LEX.RUN)),
	BETWEEN_RUNS: sequence(w(l("between")), w(LEX.RUN)),
	PROCEDURALLY_GENERATED_WORLD_STRONG: alternatives(
		sequence(
			filler(w(LEX.WORLD), { n: 1, f: w(CORE.BE) }),
			alternatives(
				sequence(w(CORE.CREATE_GENERATE), w(LEX.PROCEDURALLY)),
				sequence(w(LEX.PROCEDURALLY), w(CORE.CREATE_GENERATE)),
			),
		),
		sequence(w(LEX.PROCEDURALLY), filler(w(CORE.CREATE_GENERATE)), w(LEX.WORLD)),
	),
	PROCEDURALLY_GENERATED_WORLD_WEAK: window(
		40,
		w(LEX.PROCEDURALLY),
		w(CORE.CREATE_GENERATE),
		w(LEX.WORLD),
	),
	RANDOM_WORLDS: sequence(w(alternatives(CORE.RANDOM, CORE.UNPREDICTABLE)), w(LEX.WORLD)),
	RANDOMLY_CREATED_WORLDS: sequence(
		w(alternatives(CORE.RANDOMLY, CORE.DYNAMICALLY)),
		w(CORE.CREATE_GENERATE),
		w(LEX.WORLD),
	),
	EVER_CHANGING: sequence(w(CORE.EVER_CHANGING)),
	UNIQUE_BUILDS: sequence(w(CORE.UNIQUE_DIFFERENT), w(LEX.BUILD)),
} as const satisfies ScoreEnginePatternDictionary;

export type RunBasedPatternIdEN = keyof typeof RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN;
