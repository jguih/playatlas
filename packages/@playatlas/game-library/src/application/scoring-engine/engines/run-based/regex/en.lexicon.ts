import {
	alternatives,
	literal as l,
	plural,
	type ScoreEnginePattern,
} from "../../../language/engine.lexicon.api";

export const RUN_BASED_ENGINE_LEXICON_EN = {
	RUN: plural(
		l("run"),
		l("loop"),
		l("cycle"),
		l("playthrough"),
		l("journey"),
		l("adventure"),
		l("session"),
	),
	RESTART: alternatives(l("restart(?:ed|ing|s)?"), l("repeat(?:ed|ing|s)?")),
	LOOP: alternatives(l("every\\s+time"), l("when"), l("whenever"), l("each\\s+time")),
	POSSESSIVE: alternatives(l("her"), l("his"), l("your"), l("the")),
	WORLD: plural(
		l("map"),
		l("world"),
		l("level"),
		l("dungeon"),
		l("planet"),
		l("castle"),
		l("universe"),
		l("layout"),
	),
	DIE: alternatives(l("die(?:s|ed)?"), l("fail(?:s|ed)?")),
	PROCEDURALLY: alternatives(l("procedurally"), l("algorithmically")),
	PROCEDURAL: l("procedural"),
	CREATE: alternatives(l("generat(?:ed|ing|e|s|es)"), l("creat(?:ed|ing|e|s|es)")),
	TRY_AGAIN: alternatives(l("try\\s+again"), l("start\\s+over")),
	ENVIRONMENT: plural(l("environment")),
	LOOT: alternatives(l("ite(?:m|ns)"), l("loot"), plural(l("drop"))),
} as const satisfies Record<string, ScoreEnginePattern>;
