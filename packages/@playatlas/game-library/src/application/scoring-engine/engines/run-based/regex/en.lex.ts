import { alternatives, plural, type ScoreEngineRegexLexicon } from "../../../language";

export const RUN_BASED_ENGINE_LEXICON_EN = {
	SUBJECT_PRONOUN: alternatives("he", "she", "you"),
	BE: alternatives("is", "are", "was", "were", "be", "been", "being"),
	RUN: alternatives(
		plural("run", "loop", "cycle", "playthrough", "journey", "adventure", "session"),
	),
	RESTART: alternatives("restart(?:ed|ing|s)?", "repeat(?:ed|ing|s)?"),
	LOOP: alternatives("every\\s+time", "when", "whenever", "each\\s+time"),
	POSSESSIVE: alternatives("her", "his", "your", "the"),
	WORLD: alternatives(
		plural("map", "world", "level", "dungeon", "planet", "castle", "universe", "layout"),
	),
	DIE: alternatives("die(?:s|ed)?", "fail(?:s|ed)?"),
	PROCEDURALLY: alternatives("procedurally"),
	PROCEDURAL: alternatives("procedural"),
	REPETITION: alternatives("every", "each"),
	CREATE: alternatives("generat(?:ed|ing|e|s|es)", "creat(?:ed|ing|e|s|es)"),
	TRY_AGAIN: alternatives("try\\s+again", "start\\s+over"),
	ENVIRONMENT: alternatives(plural("environment")),
	LOOT: alternatives("ite(?:m|ns)", "loot", plural("drop")),
} as const satisfies ScoreEngineRegexLexicon;
