import { seq, withFiller } from "../../engine.language.grammar";
import { alternatives } from "../../engine.language.lex";
import { LEX } from "./pt.lex";

export const PATTERN = {
	RUN_REPETITION: seq(withFiller(LEX.REPETITION, { n: 2 }), LEX.RUN),
	RUN_AFTER_RUN: seq(LEX.RUN, "apos", LEX.RUN),
	RESTART_AFTER_DEATH: seq(
		LEX.RESTART,
		withFiller(LEX.LOOP, { n: 1, f: alternatives("ela", "ele") }),
		LEX.DEATH,
	),
};
