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
	HORROR_WORLD: sequence(
		w(LEX.HORROR_ADJECTIVES),
		w(alternatives(LEX.WORLD, LEX.JOURNEY_ADVENTURE)),
	),
	HORROR_ATMOSPHERE: sequence(w(LEX.HORROR_ADJECTIVES), w(LEX.ATMOSPHERE)),
	HORROR_ADJECTIVES: w(LEX.HORROR_ADJECTIVES),
	FIRST_PERSON_SHOOTER: w(CORE.FIRST_PERSON_SHOOTER),
	THIRD_PERSON_SHOOTER: w(CORE.THIRD_PERSON_SHOOTER),
	DEMONS_ZOMBIES: w(LEX.DEMONS_ZOMBIES),
} as const satisfies Record<string, ScoreEnginePattern>;

export type HorrorPatternIdEN = keyof typeof HORROR_ENGINE_PATTERN_DICTIONARY_EN;
