import {
	alternatives,
	filler,
	sequence,
	type ScoreEnginePatternDictionary,
} from "../../../language";
import { RUN_BASED_ENGINE_LEXICON_PT as LEX } from "./pt.lex";

export const RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT = {
	RUN_REPETITION: sequence(
		filler(LEX.REPETITION, {
			n: 1,
			f: alternatives("nov(?:a|o)", "proxim(?:a|o)", "seguinte", "diferente"),
		}),
		LEX.RUN,
	),
	RUN_AFTER_RUN: sequence(LEX.RUN, alternatives("apos"), LEX.RUN),
	RESTART_AFTER_DEATH: sequence(
		LEX.RESTART,
		filler(LEX.LOOP, { n: 1, f: alternatives("ela", "ele") }),
		LEX.DIE,
	),
	PROCEDURALLY_GENERATED_WORLD: sequence(
		filler(LEX.WORLD, {
			n: 1,
			f: alternatives("inteir(?:o|a)", "aleatoriamente", "totalmente"),
		}),
		LEX.CREATED,
		LEX.PROCEDURALLY,
	),
	RANDOM_WORLDS: sequence(LEX.WORLD, LEX.RANDOM),
	RANDOMLY_CREATED_WORLDS: sequence(LEX.WORLD, LEX.CREATED, LEX.RANDOMLY),
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
	DIE_AND_TRY_AGAIN: sequence(LEX.DIE, alternatives("e(?:\\s+entao)?"), LEX.TRY_AGAIN),
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
