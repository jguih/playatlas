import { alternatives, literal as l, plural } from "../engine.lexicon.api";

export const SCORE_ENGINE_CORE_LEXICON_PT = {
	PRONOME_SUJEITO: alternatives(l("ele"), l("ela"), l("eles"), l("voce"), l("voces")),
	PRONOME_POSSESSIVO: alternatives(
		plural(l("sua")),
		plural(l("seu")),
		plural(l("dele")),
		plural(l("dela")),
	),
	SER: alternatives(l("e"), l("sao"), l("sera"), l("era")),
	TODA_VEZ_QUE: alternatives(l("toda\\s+vez\\s+que"), l("sempre\\s+que")),
	EM_CADA: alternatives(l("(?:a|em|por)\\s+cada"), l("entre"), l("outra")),
	QUANDO_SEMPRE: alternatives(l("quando"), l("sempre")),
	RECOMECAR_REINICIAR: alternatives(l("recomec(?:e|ar|a)"), l("reinici(?:e|ar|a)")),
	RECOMECA_REINICIA: alternatives(l("recomec(?:e|a)"), l("reinici(?:e|a)")),
	CRIADO_GERADO: alternatives(plural(l("gerad(?:o|a)"), l("criad(?:o|a)"))),
	MORRER_FALHAR: alternatives(l("falh(?:ar|ou|ando|e)"), l("morr(?:er|eu|endo|ia|e|a)")),
	MORTE_FALHA: alternatives(l("morte"), l("falha")),
	FIM: alternatives(plural(l("fim"))),
	ALEATORIO: alternatives(plural(l("aleatori(?:o|os|a|as)")), l("randomico")),
	ALEATORIAMENTE: alternatives(
		l("aleatoriamente"),
		l("de\\s+(?:maneira|forma)\\s+aleatoria"),
		l("randomicamente"),
		l("de\\s+(?:maneira|forma)\\s+randomica"),
	),
	EM_CONSTANTE_MUDANCA: alternatives(
		l("em\\s+constante\\s+mudanca"),
		l("em\\s+mudanca\\s+constante"),
		l("(?:sempre\\s+)mud(?:a|ando|am)"),
		l("mud(?:a|am|ando)\\s+constantemente"),
	),
	INIMIGO: plural(l("inimigo")),
	IGUAL: alternatives(l("igual"), l("igual\\s+(?:a|ao)\\s+outr(?:a|o)"), l("igual\\s+(?:a|ao)")),
	DIFFERENTE_UNICA: alternatives(l("diferente"), l("unic(?:a|o)")),
	VARIOS_DIVERSOS: alternatives(
		plural(l("divers(?:a|o)"), l("vari(?:o|a)"), l("multipl(?:o|a)")),
		l("variad(?:as|os)"),
	),
	VARIEDADE_DIVERSIDADE: alternatives(l("variedade"), l("diversidade")),
} as const;
