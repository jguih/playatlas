import { SCORE_ENGINE_CORE_LEXICON_PT as CORE } from "../../../language";
import {
	alternatives,
	filler,
	literal as l,
	sequence,
	word as w,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";
import { RUN_BASED_ENGINE_LEXICON_PT as LEX } from "./pt.lexicon";

export const RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT = {
	ROGUELIKE_LITE: w(LEX.ROGUELIKE_LITE),
	RUN_REPETITION: sequence(
		filler(w(CORE.EM_CADA), {
			n: 1,
			f: w(alternatives(l("nov(?:a|o)"), l("proxim(?:a|o)"), l("diferente"), l("seguinte"))),
		}),
		w(LEX.PARTIDA),
	),
	RUN_AFTER_RUN: sequence(w(LEX.PARTIDA), alternatives(l("apos")), w(LEX.PARTIDA)),
	PROCEDURALLY_GENERATED_WORLD: sequence(
		filler(w(LEX.MUNDO), {
			n: 1,
			f: w(LEX.MODIFICADOR_GERACAO_MUNDO),
		}),
		filler(w(CORE.CRIADO_GERADO), {
			n: 1,
			f: w(LEX.MODIFICADOR_GERACAO_MUNDO),
		}),
		w(LEX.PROCEDURALMENTE),
	),
	RANDOM_WORLDS: sequence(w(LEX.MUNDO), w(CORE.ALEATORIO)),
	RANDOMLY_CREATED_WORLDS: sequence(
		w(LEX.MUNDO),
		w(CORE.CRIADO_GERADO),
		w(alternatives(CORE.ALEATORIAMENTE, CORE.DINAMICAMENTE)),
	),
	EVER_CHANGING: sequence(w(CORE.EM_CONSTANTE_MUDANCA)),
	UNIQUE_BUILDS: alternatives(
		sequence(w(LEX.BUILD), w(alternatives(CORE.DIFERENTE_DISTINTO, CORE.UNICO))),
		sequence(w(CORE.DIFERENTE_DISTINTO), w(LEX.BUILD)),
		sequence(w(CORE.CONFIGURACAO), w(CORE.UNICO)),
		sequence(w(CORE.CONFIGURACAO), w(l("poderos(?:a|as)"))),
		sequence(
			w(alternatives(CORE.VARIEDADE_DIVERSIDADE, CORE.POSSIBILIDADE)),
			w(l("de")),
			w(LEX.BUILD),
		),
		sequence(
			w(CORE.VARIOS_NUMERICO),
			w(LEX.BUILD),
			w(alternatives(CORE.DIFERENTE_DISTINTO, CORE.UNICO)),
		),
	),
} as const satisfies Record<string, ScoreEnginePattern>;

export type RunBasedPatternIdPT = keyof typeof RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT;
