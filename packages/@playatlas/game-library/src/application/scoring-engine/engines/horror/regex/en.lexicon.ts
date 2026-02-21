import {
	alternatives,
	literal as l,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";

export const HORROR_ENGINE_LEXICON_EN = {
	PSYCHOLOGICAL_HORROR: alternatives(l("psychological\\s+horror"), l("psychological-horror")),
} as const satisfies Record<string, ScoreEnginePattern>;
