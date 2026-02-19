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
	RUN_REPETITION: sequence(
		filler(w(CORE.EM_CADA), {
			n: 1,
			f: w(alternatives(l("nov(?:a|o)"), l("proxim(?:a|o)"), l("diferente"), l("seguinte"))),
		}),
		w(LEX.PARTIDA),
	),
	RUN_AFTER_RUN: sequence(w(LEX.PARTIDA), alternatives(l("apos")), w(LEX.PARTIDA)),
	RESTART_AFTER_DEATH: sequence(
		w(CORE.RECOMECAR_REINICIAR),
		filler(w(LEX.LOOP), { n: 1, f: w(alternatives(l("ela"), l("ele"))) }),
		w(CORE.MORRER_FALHAR),
	),
	PROCEDURALLY_GENERATED_WORLD: sequence(
		filler(w(LEX.MUNDO), {
			n: 1,
			f: w(LEX.MODIFICADOR_GERACAO_MUNDO),
		}),
		filler(w(CORE.CRIAR_GERAR), {
			n: 1,
			f: w(LEX.MODIFICADOR_GERACAO_MUNDO),
		}),
		w(LEX.PROCEDURALMENTE),
	),
	RANDOM_WORLDS: sequence(w(LEX.MUNDO), w(CORE.ALEATORIO)),
	RANDOMLY_CREATED_WORLDS: sequence(w(LEX.MUNDO), w(CORE.CRIAR_GERAR), w(CORE.ALEATORIAMENTE)),
	EVER_CHANGING_WORLDS: sequence(
		filler(w(LEX.MUNDO), { n: 1, f: w(LEX.MODIFICADOR_MUDANCA) }),
		w(CORE.EM_CONSTANTE_MUDANCA),
	),
} as const satisfies Record<string, ScoreEnginePattern>;
