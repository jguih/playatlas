import { SCORE_ENGINE_CORE_LEXICON_EN as CORE } from "../../../language";
import {
	alternatives,
	filler,
	literal as l,
	sequence,
	word,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";
import { RUN_BASED_ENGINE_LEXICON_EN as LEX } from "./en.lexicon";

export const RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN = {
	RUN_REPETITION: sequence(
		filler(word(CORE.EACH_EVERY), {
			n: 1,
			f: word(alternatives(l("new"), l("subsequent"), l("different"))),
		}),
		word(LEX.RUN),
	),
} as const satisfies Record<string, ScoreEnginePattern>;
