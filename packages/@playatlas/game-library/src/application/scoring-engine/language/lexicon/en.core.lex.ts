import { alternatives, literal as l } from "../engine.lexicon.api";

export const SCORE_ENGINE_CORE_LEXICON_EN = {
	SUBJECT_PRONOUN: alternatives(l("he"), l("she"), l("it"), l("you")),
	BE: alternatives(l("is"), l("are"), l("was"), l("were"), l("be"), l("been"), l("being")),
	EVERY_TIME: alternatives(l("every\\s+time"), l("each\\s+time"), l("all\\s+the\\s+time")),
	EACH_EVERY: alternatives(l("every"), l("each")),
} as const;
