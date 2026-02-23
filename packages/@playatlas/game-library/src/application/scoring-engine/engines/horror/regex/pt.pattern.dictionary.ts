import { SCORE_ENGINE_CORE_LEXICON_PT as CORE } from "../../../language";
import { word as w, type ScoreEnginePattern } from "../../../language/engine.lexicon.api";
import { HORROR_ENGINE_LEXICON_PT as LEX } from "./pt.lexicon";

export const HORROR_ENGINE_PATTERN_DICTIONARY_PT = {
	PSYCHOLOGICAL_HORROR: w(LEX.TERROR_PSICOLOGICO),
	SURVIVAL_HORROR: w(LEX.TERROR_DE_SOBREVIVENCIA),
	FIRST_PERSON_SHOOTER: w(CORE.TIRO_EM_PRIMEIRA_PESSOA),
	THIRD_PERSON_SHOOTER: w(CORE.TIRO_EM_TERCEIRA_PESSOA),
	PERTURBADOR: w(LEX.PERTURBADOR),
} as const satisfies Record<string, ScoreEnginePattern>;

export type HorrorPatternIdPT = keyof typeof HORROR_ENGINE_PATTERN_DICTIONARY_PT;
