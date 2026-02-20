import { SCORE_ENGINE_CORE_LEXICON_PT as CORE } from "../../../language";
import {
	alternatives,
	literal as l,
	plural,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";

export const RUN_BASED_ENGINE_LEXICON_PT = {
	PARTIDA: alternatives(
		plural(
			l("run"),
			l("loop"),
			l("ciclo"),
			l("playthrough"),
			l("jornada"),
			l("aventura"),
			l("partida"),
			l("tentativa"),
		),
		l("sess(?:ao|oes)"),
	),
	MUNDO: alternatives(
		plural(
			l("mapa"),
			l("mundo"),
			l("level"),
			l("masmorra"),
			l("planeta"),
			l("ambiente"),
			l("castelo"),
			l("dungeon"),
			l("fase"),
		),
		l("nive(?:l|is)"),
	),
	LOOP: alternatives(CORE.QUANDO_SEMPRE, CORE.TODA_VEZ_QUE),
	LOOT: alternatives(l("ite(?:m|ns)"), l("loot"), plural(l("drop")), plural(l("recompensa"))),
	PROCEDURALMENTE: alternatives(l("proceduralmente"), l("de\\s+(?:forma|maneira)\\s+procedural")),
	MODIFICADOR_GERACAO_MUNDO: alternatives(
		l("inteir(?:o|a|amente)"),
		l("aleatoriamente"),
		l("totalmente"),
		CORE.SER,
	),
	MODIFICADOR_MUDANCA: alternatives(l("que"), l("que\\s+est(?:a|ao)")),
	TENTE_NOVAMENTE: alternatives(
		l("tente\\s+(?:de\\s+novo|novamente)"),
		l("tente\\s+uma\\s+(?:segunda|outra)\\s+vez"),
	),
	BUILD_ITEMS: alternatives(
		l("armas"),
		l("habilidades"),
		l("equipamentos"),
		l("poderes"),
		l("melhorias"),
	),
	AMBIENTE: plural(l("ambiente")),
} as const satisfies Record<string, ScoreEnginePattern>;
