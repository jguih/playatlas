import {
	alternatives,
	literal as l,
	plural,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";

export const HORROR_ENGINE_LEXICON_PT = {
	TERROR_PSICOLOGICO: alternatives(l("terror\\s+psicologico"), l("terror-psicologico")),
	TERROR_DE_SOBREVIVENCIA: l("terror\\s+de\\s+sobrevivencia"),
	TERROR_ADJETIVOS: alternatives(
		l("perturbador(a)?"),
		l("inquietante"),
		l("aterrorizante"),
		l("apavorante"),
		l("assombrad(?:o|a)"),
		l("assustador(a)?"),
		l("sinistr(?:o|a)"),
		l("apavorante"),
		l("sombrio"),
	),
	TERROR_NOMES: alternatives(l("terror"), l("pavor"), l("medo"), l("angústia"), l("desespero")),
	TERROR_CONECTORES: alternatives(
		l("replet(?:a|o)\\s+de"),
		l("chei(?:a|o)\\s+de"),
		l("carregad(?:a|o)\\s+de"),
		l("tomad(?:a|o)\\s+por"),
		l("dominad(?:a|o)\\s+por"),
		l("de"),
	),
	ATMOSFERA: l("atmosfera"),
	MUNDO: l("mundo"),
	JORNADA_AVENTURA: alternatives(l("jornada"), l("aventura")),
	DEMONIOS_ZUMBIS: alternatives(plural(l("demonio"), l("zumbi"))),
} as const satisfies Record<string, ScoreEnginePattern>;
