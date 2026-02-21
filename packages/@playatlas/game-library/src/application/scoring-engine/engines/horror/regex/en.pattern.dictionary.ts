import { sequence, word as w, type ScoreEnginePattern } from "../../../language/engine.lexicon.api";
import { HORROR_ENGINE_LEXICON_EN as LEX } from "./en.lexicon";

export const HORROR_ENGINE_PATTERN_DICTIONARY_EN = {
	PSYCHOLOGICAL_HORROR: sequence(w(LEX.PSYCHOLOGICAL_HORROR)),
} as const satisfies Record<string, ScoreEnginePattern>;

export type HorrorPatternIdEN = keyof typeof HORROR_ENGINE_PATTERN_DICTIONARY_EN;
