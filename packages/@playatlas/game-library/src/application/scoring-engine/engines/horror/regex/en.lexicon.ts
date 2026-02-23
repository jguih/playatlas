import {
	alternatives,
	literal as l,
	plural,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";

export const HORROR_ENGINE_LEXICON_EN = {
	PSYCHOLOGICAL_HORROR: alternatives(l("psychological\\s+horror"), l("psychological-horror")),
	HORROR_ADJECTIVES: alternatives(
		l("dread"),
		l("eerie"),
		l("sinister"),
		l("haunting"),
		l("terrifying"),
		l("unsettling"),
		l("dread-filled"),
		l("dread\\s+filled"),
	),
	ATMOSPHERE: l("atmosphere"),
	WORLD: l("world"),
	JOURNEY_ADVENTURE: alternatives(l("journey"), l("adventure")),
	DEMONS_ZOMBIES: alternatives(plural(l("demon"), l("zombie"))),
} as const satisfies Record<string, ScoreEnginePattern>;
