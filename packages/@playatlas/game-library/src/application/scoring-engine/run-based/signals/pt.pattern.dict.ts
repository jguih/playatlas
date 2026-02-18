import { filler, sequence } from "../../engine.language.grammar";
import { alternatives } from "../../engine.language.lexicon";
import { LEX } from "./pt.lex";

export const PATTERN = {
	RUN_REPETITION: sequence(
		filler(LEX.REPETITION, {
			n: 1,
			f: alternatives("nov(?:a|o)", "proxim(?:a|o)", "seguinte", "diferente"),
		}),
		LEX.RUN,
	),
	RUN_AFTER_RUN: sequence(LEX.RUN, "apos", LEX.RUN),
	RESTART_AFTER_DEATH: sequence(
		LEX.RESTART,
		filler(LEX.LOOP, { n: 1, f: alternatives("ela", "ele") }),
		LEX.DEATH,
	),
	PROCEDURALLY_GENERATED_WORLD: sequence(
		filler(LEX.WORLD, { n: 1, f: alternatives("inteir(?:o|a)", "aleatoriamente", "totalmente") }),
		LEX.CREATED,
		LEX.PROCEDURAL,
	),
	RANDOM_WORLDS: sequence(LEX.WORLD, LEX.RANDOM),
	RANDOMLY_CREATED_WORLDS: sequence(LEX.WORLD, LEX.CREATED, LEX.RANDOM),
	EVER_CHANGING_WORLDS: sequence(
		filler(LEX.WORLD, { n: 1, f: alternatives("que") }),
		LEX.EVER_CHANGING,
	),
} as const satisfies Record<string, RegExp>;
