import { type ScoreEngineLexicon } from "../../../language";
import { alternatives, literal as l, plural } from "../../../language/engine.lexicon.api";

export const RUN_BASED_ENGINE_LEXICON_EN = {
	ROGUELIKE_LITE: alternatives(
		l("roguelike"),
		l("rogue-like"),
		l("roguelite"),
		l("rogue-lite"),
		l("roguevania"),
		l("rogue-vania"),
	),
	RUN: plural(
		l("run"),
		l("loop"),
		l("cycle"),
		l("playthrough"),
		l("journey"),
		l("adventure"),
		l("session"),
	),
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
	BUILD: plural(l("build")),
} as const satisfies ScoreEngineLexicon;
