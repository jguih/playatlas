import { SCORE_ENGINE_CORE_LEXICON_EN as CORE } from "../../../language";
import {
	alternatives,
	sequence,
	word as w,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";
import { HORROR_ENGINE_LEXICON_EN as LEX } from "./en.lexicon";

export const HORROR_ENGINE_PATTERN_DICTIONARY_EN = {
	PSYCHOLOGICAL_HORROR: sequence(w(LEX.PSYCHOLOGICAL_HORROR)),
	UNSETTLING_WORLD_ADVENTURE: sequence(
		w(LEX.UNSETTLING),
		w(alternatives(LEX.WORLD, LEX.JOURNEY_ADVENTURE)),
	),
	UNSETTLING_ATMOSPHERE: sequence(w(LEX.UNSETTLING), w(LEX.ATMOSPHERE)),
	UNSETTLING: w(LEX.UNSETTLING),
	FIRST_PERSON_SHOOTER: w(CORE.FIRST_PERSON_SHOOTER),
	THIRD_PERSON_SHOOTER: w(CORE.THIRD_PERSON_SHOOTER),
} as const satisfies Record<string, ScoreEnginePattern>;

export type HorrorPatternIdEN = keyof typeof HORROR_ENGINE_PATTERN_DICTIONARY_EN;
