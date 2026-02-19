import {
	alternatives,
	anyOf,
	filler,
	sequence,
	window,
	type ScoreEnginePatternDictionary,
} from "../../../language";
import { RUN_BASED_ENGINE_LEXICON_EN as LEX } from "./en.lex";

export const RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN = {
	RUN_REPETITION: sequence(
		filler(LEX.REPETITION, {
			n: 1,
			f: alternatives("new", "subsequent", "different"),
		}),
		LEX.RUN,
	),
	RUN_AFTER_RUN: sequence(LEX.RUN, alternatives("after"), LEX.RUN),
	BETWEEN_RUNS: sequence(alternatives("between"), LEX.RUN),
	RESTART_AFTER_DEATH: sequence(
		LEX.RESTART,
		LEX.POSSESSIVE,
		LEX.RUN,
		LEX.LOOP,
		LEX.SUBJECT_PRONOUN,
		LEX.DIE,
	),
	PROCEDURALLY_GENERATED_WORLD_STRONG: anyOf(
		anyOf(
			sequence(filler(LEX.WORLD, { n: 1, f: LEX.BE }), LEX.CREATE, LEX.PROCEDURALLY),
			sequence(filler(LEX.WORLD, { n: 1, f: LEX.BE }), LEX.PROCEDURALLY, LEX.CREATE),
		),
		sequence(LEX.PROCEDURALLY, filler(LEX.CREATE), LEX.WORLD),
	),
	PROCEDURALLY_GENERATED_WORLD_WEAK: window([LEX.PROCEDURALLY, LEX.CREATE, LEX.WORLD], 40),
	PROCEDURAL_WORLD: sequence(LEX.PROCEDURAL, LEX.WORLD),
	TRY_AGAIN: sequence(LEX.TRY_AGAIN),
	DIE_AND_TRY_AGAIN: sequence(
		filler(LEX.DIE, { n: 1, f: alternatives("(?:and|then)") }),
		LEX.TRY_AGAIN,
	),
	RUN_RESTARTS_ON_DEATH: sequence(
		LEX.RUN,
		LEX.RESTART,
		alternatives("ao", "quando(?:\\s+voce)?"),
		LEX.DIE,
	),
} as const satisfies ScoreEnginePatternDictionary;
