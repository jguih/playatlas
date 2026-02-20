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
		filler(w(CORE.CRIADO_GERADO), {
			n: 1,
			f: w(LEX.MODIFICADOR_GERACAO_MUNDO),
		}),
		w(LEX.PROCEDURALMENTE),
	),
	RANDOM_WORLDS: sequence(w(LEX.MUNDO), w(CORE.ALEATORIO)),
	RANDOMLY_CREATED_WORLDS: sequence(w(LEX.MUNDO), w(CORE.CRIADO_GERADO), w(CORE.ALEATORIAMENTE)),
	EVER_CHANGING_WORLDS: sequence(
		filler(w(LEX.MUNDO), { n: 1, f: w(LEX.MODIFICADOR_MUDANCA) }),
		w(CORE.EM_CONSTANTE_MUDANCA),
	),
	EVER_CHANGING_ENVIRONMENT: sequence(
		filler(w(LEX.AMBIENTE), { n: 1, f: w(LEX.MODIFICADOR_MUDANCA) }),
		w(CORE.EM_CONSTANTE_MUDANCA),
	),
	EVER_CHANGING: sequence(w(CORE.EM_CONSTANTE_MUDANCA)),
	TRY_AGAIN: sequence(w(LEX.TENTE_NOVAMENTE)),
	DIE_AND_TRY_AGAIN: sequence(
		w(CORE.MORRER_FALHAR),
		w(alternatives(l("e(?:\\s+entao)?"))),
		w(LEX.TENTE_NOVAMENTE),
	),
	DEATH_RESTARTS_YOUR_RUN: sequence(
		w(l("a")),
		w(CORE.MORTE_FALHA),
		w(CORE.RECOMECA_REINICIA),
		w(alternatives(l("(?:a\\s+)?sua"), l("(?:o\\s+)?seu"), l("(?:a|o)"))),
		w(LEX.PARTIDA),
	),
	RUN_RESTARTS_ON_DEATH: sequence(
		w(LEX.PARTIDA),
		w(CORE.RECOMECA_REINICIA),
		w(alternatives(l("ao"), l("quando(?:\\s+voce)?"))),
		w(CORE.MORRER_FALHAR),
	),
	RANDOM_LOOT: sequence(w(LEX.LOOT), w(CORE.ALEATORIO)),
	LOOT_VOLUME_SPECIFIC: sequence(
		filler(l("\\d+\\+?"), { n: 1, f: w(l("mais\\s+(?:que|de)")), d: "before" }),
		w(LEX.LOOT),
	),
	RANDOM_ENEMY: sequence(w(CORE.INIMIGO), w(CORE.ALEATORIO)),
	ENEMY_VOLUME_SPECIFIC: sequence(
		filler(l("\\d+\\+?"), { n: 1, f: w(l("mais\\s+(?:que|de)")), d: "before" }),
		w(CORE.INIMIGO),
	),
	NO_RUN_IS_THE_SAME: sequence(w(l("nenhum(?:a)?")), w(LEX.PARTIDA), w(CORE.SER), w(CORE.IGUAL)),
	EACH_RUN_IS_DIFFERENT: sequence(
		w(l("cada")),
		w(LEX.PARTIDA),
		w(CORE.SER),
		alternatives(w(CORE.DIFERENTE_DISTINTO), w(CORE.UNICO)),
	),
	VARIETY_OF_BUILD_ITEMS: alternatives(
		sequence(w(CORE.VARIEDADE_DIVERSIDADE), w(l("de")), w(LEX.BUILD_ITEMS)),
		sequence(w(CORE.VARIOS_DIVERSOS), w(LEX.BUILD_ITEMS)),
		sequence(w(LEX.BUILD_ITEMS), w(CORE.VARIOS_DIVERSOS)),
	),
	CONSTANTLY_CHANGING_BUILD_ITEMS: sequence(
		filler(w(LEX.BUILD_ITEMS), { n: 1, f: w(LEX.MODIFICADOR_MUDANCA) }),
		w(CORE.EM_CONSTANTE_MUDANCA),
	),
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
	ENDLESS_WAYS_TO_COMBINE_BUILD_ITEMS: alternatives(
		sequence(
			filler(w(CORE.MANEIRA_FORMA), { n: 1, f: w(LEX.INTENSIFICADOR) }),
			w(alternatives(CORE.ILIMITADO, CORE.SEM_LIMITE)),
			w(l("de")),
			filler(w(alternatives(CORE.COMBINAR, CORE.CRIAR)), { n: 1, f: w(CORE.PRONOME_POSSESSIVO) }),
			w(alternatives(LEX.BUILD_ITEMS, CORE.SINERGIA, CORE.ESTILO_DE_JOGO, CORE.ESTRATEGIA)),
		),
		sequence(
			w(alternatives(CORE.ILIMITADO, CORE.VARIOS_NUMERICO)),
			filler(w(CORE.MANEIRA_FORMA), { n: 1, f: w(CORE.DIFERENTE_DISTINTO) }),
			w(l("de")),
			filler(w(alternatives(CORE.COMBINAR, CORE.CRIAR)), { n: 1, f: w(CORE.PRONOME_POSSESSIVO) }),
			w(alternatives(LEX.BUILD_ITEMS, CORE.SINERGIA, CORE.ESTILO_DE_JOGO, CORE.ESTRATEGIA)),
		),
	),
} as const satisfies Record<string, ScoreEnginePattern>;
