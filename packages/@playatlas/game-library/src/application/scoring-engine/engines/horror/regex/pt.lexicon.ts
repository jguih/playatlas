import {
	alternatives,
	literal as l,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";

export const HORROR_ENGINE_LEXICON_PT = {
	TERROR_PSICOLOGICO: alternatives(l("terror\\s+psicologico"), l("terror-psicologico")),
	TERROR_DE_SOBREVIVENCIA: l("terror\\s+de\\s+sobrevivencia"),
	PERTURBADOR: alternatives(
		l("perturbador"),
		l("inquietante"),
		l("aterrorizante"),
		l("apavorante"),
		l("assombrado"),
		l("assustador"),
		l("sinistro"),
		l("pavor"),
	),
	ATMOSPHERE: l("atmosfera"),
	WORLD: l("world"),
	JOURNEY_ADVENTURE: alternatives(l("journey"), l("adventure")),
} as const satisfies Record<string, ScoreEnginePattern>;
