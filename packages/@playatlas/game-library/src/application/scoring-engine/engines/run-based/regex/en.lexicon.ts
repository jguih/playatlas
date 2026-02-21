import { SCORE_ENGINE_CORE_LEXICON_EN as CORE, type ScoreEngineLexicon } from "../../../language";
import { alternatives, literal as l, plural } from "../../../language/engine.lexicon.api";

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
	LOOP: alternatives(CORE.WHEN_WHENEVER, CORE.EVERY_TIME),
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
	PROCEDURALLY: alternatives(l("procedurally"), l("algorithmically")),
	PROCEDURAL: l("procedural"),
	TRY_AGAIN: alternatives(l("try\\s+again"), l("start\\s+over"), l("retry")),
	ENVIRONMENT: plural(l("environment")),
	LOOT: alternatives(l("ite(?:m|ns)"), l("loot"), plural(l("drop"))),
	START_FROM_RETURN_TO: alternatives(
		l("back\\s+to"),
		l("return\\s+to"),
		l("sent\\s+back"),
		l("start\\s+from"),
		l("start\\s+over"),
	),
} as const satisfies ScoreEngineLexicon;
