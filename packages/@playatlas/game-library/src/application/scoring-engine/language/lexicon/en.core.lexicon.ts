import { alternatives, literal as l, plural } from "../engine.lexicon.api";

export const SCORE_ENGINE_CORE_LEXICON_EN = {
	SUBJECT_PRONOUN: alternatives(l("he"), l("she"), l("it"), l("you"), l("they")),
	POSSESSIVE_PRONOUN: alternatives(
		plural(l("her")),
		l("his"),
		plural(l("your")),
		plural(l("their")),
	),
	BE: alternatives(l("is"), l("are"), l("was"), l("were"), l("be"), l("been"), l("being")),
	EVERY_TIME: alternatives(l("every\\s+time"), l("each\\s+time")),
	EACH_EVERY: alternatives(l("every"), l("each")),
	WHEN_WHENEVER: alternatives(l("when"), l("whenever")),
	RESTART_REPEAT: alternatives(l("restart(?:ed|ing|s)?"), l("repeat(?:ed|ing|s)?")),
	CREATE_GENERATE: alternatives(l("generat(?:ed|ing|e|s|es)"), l("creat(?:ed|ing|e|s|es)")),
	DIE_FAIL: alternatives(l("die(?:s|ed)?"), l("fail(?:s|ed)?")),
	DEATH_FAILURE: alternatives(l("death"), l("failure")),
	END: alternatives(plural(l("end"))),
} as const;
