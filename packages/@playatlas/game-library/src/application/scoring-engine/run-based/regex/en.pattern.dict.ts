import {
	filler,
	sequence,
	window,
	type ScoreEnginePatternDictionary,
} from "../../engine.language.grammar";
import { alternatives } from "../../engine.language.lexicon";
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
	PROCEDURALLY_GENERATED_WORLD: window([LEX.WORLD, LEX.CREATE, LEX.PROCEDURALLY], 40),
	PROCEDURAL_WORLD: sequence(LEX.PROCEDURAL, LEX.WORLD),
	RANDOM_WORLDS: sequence(LEX.WORLD, LEX.RANDOM),
	RANDOMLY_CREATED_WORLDS: sequence(LEX.WORLD, LEX.CREATE, LEX.RANDOMLY),
	EVER_CHANGING_WORLDS: sequence(
		filler(LEX.WORLD, { n: 1, f: alternatives("que", "que\\s+est(?:a|ao)") }),
		LEX.EVER_CHANGING,
	),
	EVER_CHANGING_ENVIRONMENT: sequence(
		filler(LEX.ENVIRONMENT, { n: 1, f: alternatives("que", "que\\s+est(?:a|ao)") }),
		LEX.EVER_CHANGING,
	),
	EVER_CHANGING: sequence(LEX.EVER_CHANGING),
	TRY_AGAIN: sequence(LEX.TRY_AGAIN),
	DIE_AND_TRY_AGAIN: sequence(
		filler(LEX.DIE, { n: 1, f: alternatives("(?:and|then)") }),
		LEX.TRY_AGAIN,
	),
	DEATH_RESTARTS_YOUR_RUN: sequence(
		LEX.DEATH,
		LEX.RESTART,
		alternatives("(?:a\\s+)?sua", "(?:o\\s+)seu"),
		LEX.RUN,
	),
	RUN_RESTARTS_ON_DEATH: sequence(
		LEX.RUN,
		LEX.RESTART,
		alternatives("ao", "quando(?:\\s+voce)?"),
		LEX.DIE,
	),
	RANDOM_LOOT: sequence(LEX.LOOT, LEX.RANDOM),
	LOOT_VOLUME_SPECIFIC: sequence(
		filler(LEX.LOOT_VOLUME_NUMERIC, { n: 1, f: alternatives("mais\\s+(?:que|de)"), d: "before" }),
	),
	RANDOM_ENEMY: sequence(LEX.ENEMY, LEX.RANDOM),
	ENEMY_VOLUME_SPECIFIC: sequence(
		filler(LEX.ENEMY_VOLUME_NUMERIC, { n: 1, f: alternatives("mais\\s+(?:que|de)"), d: "before" }),
	),
	NO_RUN_IS_THE_SAME: sequence(
		alternatives("nenhum(?:a)?"),
		LEX.RUN,
		alternatives("e", "sera"),
		LEX.SAME,
	),
	EACH_RUN_IS_DIFFERENT: sequence(
		alternatives("cada"),
		LEX.RUN,
		alternatives("e", "sera"),
		LEX.DIFFERENT,
	),
	VARIETY_OF_BUILD_ITEMS: sequence(
		filler(LEX.VARIETY, { n: 1, f: alternatives("de") }),
		LEX.BUILD_ITEMS,
	),
} as const satisfies ScoreEnginePatternDictionary;
