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
	RUN_REPETITION: sequence(
		filler(w(CORE.EACH_EVERY), {
			n: 1,
			f: w(alternatives(l("(single\\s+)?new"), l("subsequent"), l("different"))),
		}),
		w(LEX.RUN),
	),
	RUN_AFTER_RUN: sequence(w(LEX.RUN), w(l("after")), w(LEX.RUN)),
	BETWEEN_RUNS: sequence(w(l("between")), w(LEX.RUN)),
	RESTART_AFTER_DEATH: sequence(
		w(CORE.RESTART_REPEAT),
		w(alternatives(CORE.POSSESSIVE_PRONOUN, l("the"))),
		w(LEX.RUN),
		w(LEX.LOOP),
		w(CORE.SUBJECT_PRONOUN),
		w(CORE.DIE_FAIL),
	),
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
	PROCEDURAL_WORLD: sequence(w(LEX.PROCEDURAL), w(LEX.WORLD)),
	TRY_AGAIN: sequence(w(LEX.TRY_AGAIN)),
	DIE_AND_TRY_AGAIN: sequence(
		filler(w(CORE.DIE_FAIL), { n: 1, f: w(alternatives(l("and"), l("then"))) }),
		w(LEX.TRY_AGAIN),
	),
	RUN_RESTARTS_ON_DEATH: alternatives(
		sequence(
			w(LEX.RUN),
			w(alternatives(CORE.RESTART_REPEAT, CORE.END)),
			w(l("when")),
			w(CORE.SUBJECT_PRONOUN),
			w(CORE.DIE_FAIL),
		),
		sequence(
			w(LEX.RUN),
			w(alternatives(CORE.RESTART_REPEAT, CORE.END)),
			w(l("on")),
			w(CORE.DEATH_FAILURE),
		),
	),
	RANDOM_WORLDS: sequence(w(alternatives(CORE.RANDOM, CORE.UNPREDICTABLE)), w(LEX.WORLD)),
	RANDOMLY_CREATED_WORLDS: sequence(
		w(alternatives(CORE.RANDOMLY, CORE.DYNAMICALLY)),
		w(CORE.CREATE_GENERATE),
		w(LEX.WORLD),
	),
	DYNAMIC_WORLD_GENERATION: sequence(
		w(alternatives(CORE.DYNAMIC, CORE.RANDOM)),
		w(LEX.WORLD),
		w(CORE.CREATION_GENERATION),
	),
	EVER_CHANGING: sequence(w(CORE.EVER_CHANGING)),
	EVER_CHANGING_ENVIRONMENT: sequence(
		w(CORE.EVER_CHANGING),
		w(alternatives(LEX.WORLD, LEX.ENVIRONMENT)),
	),
	FRESH_WORLD_EVERY_RUN: sequence(
		w(alternatives(CORE.UNIQUE_DIFFERENT, l("fresh"))),
		w(LEX.WORLD),
		w(CORE.EACH_EVERY),
		w(alternatives(LEX.RUN, l("time"))),
	),
	DEATH_RESETS_YOUR_RUN: alternatives(
		sequence(
			w(CORE.DEATH_FAILURE),
			w(alternatives(CORE.RESET, CORE.RESTART_REPEAT)),
			w(alternatives(CORE.POSSESSIVE_PRONOUN, l("the"))),
			w(LEX.RUN),
		),
		sequence(
			w(LEX.RUN),
			w(alternatives(CORE.RESET, CORE.RESTART_REPEAT)),
			w(l("on")),
			w(CORE.DEATH_FAILURE),
		),
	),
	START_FROM_THE_BEGINNING: sequence(
		filler(w(LEX.START_FROM_RETURN_TO), { n: 1, f: w(l("the")) }),
		w(CORE.BEGINNING_START),
	),
	EVERY_RUN_IS_DIFFERENT: sequence(
		w(CORE.EACH_EVERY),
		w(LEX.RUN),
		w(l("is")),
		w(CORE.UNIQUE_DIFFERENT),
	),
} as const satisfies ScoreEnginePatternDictionary;

export type RunBasedPatternIdEN = keyof typeof RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN;
