import { SCORE_ENGINE_CORE_LEXICON_PT as CORE } from "../../../language";
import {
	alternatives,
	filler,
	sequence,
	word as w,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";
import { HORROR_ENGINE_LEXICON_PT as LEX } from "./pt.lexicon";

export const HORROR_ENGINE_PATTERN_DICTIONARY_PT = {
	PSYCHOLOGICAL_HORROR: w(LEX.TERROR_PSICOLOGICO),
	SURVIVAL_HORROR: w(LEX.TERROR_DE_SOBREVIVENCIA),
	FIRST_PERSON_SHOOTER: w(CORE.TIRO_EM_PRIMEIRA_PESSOA),
	THIRD_PERSON_SHOOTER: w(CORE.TIRO_EM_TERCEIRA_PESSOA),
	TERROR_ADJ_NOME: w(alternatives(LEX.TERROR_ADJETIVOS, LEX.TERROR_NOMES)),
	DEMONIOS_ZUMBIS: w(LEX.DEMONIOS_ZUMBIS),
	MUNDO_ATERRORIZANTE: sequence(
		w(alternatives(LEX.MUNDO, LEX.JORNADA_AVENTURA, LEX.ATMOSFERA)),
		w(LEX.TERROR_ADJETIVOS),
	),
	MUNDO_REPLETO_DE_TERROR: sequence(
		filler(w(alternatives(LEX.MUNDO, LEX.JORNADA_AVENTURA, LEX.ATMOSFERA)), {
			n: 1,
			f: w(LEX.TERROR_CONECTORES),
		}),
		w(LEX.TERROR_NOMES),
	),
} as const satisfies Record<string, ScoreEnginePattern>;

export type HorrorPatternIdPT = keyof typeof HORROR_ENGINE_PATTERN_DICTIONARY_PT;
