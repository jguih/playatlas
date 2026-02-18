import { alternatives, plural } from "../../engine.language.lexicon";

export const LEX = {
	RUN: alternatives(
		plural("run", "loop", "ciclo", "playthrough", "jornada", "aventura", "partida", "tentativa"),
		"sess(?:ao|oes)",
	),
	RESTART: alternatives("recomecar", "reiniciar"),
	LOOP: alternatives("toda\\s+vez\\s+que", "sempre\\s+que", "sempre", "quando"),
	WORLD: alternatives(
		plural(
			"mapa",
			"mundo",
			"level",
			"masmorra",
			"planeta",
			"ambiente",
			"castelo",
			"dungeon",
			"fase",
		),
		"nive(?:l|is)",
	),
	DEATH: alternatives("falhar", "morr(?:e|er|eu|endo|ia)"),
	PROCEDURAL: alternatives("proceduralmente", "de\\s+(?:forma|maneira)\\s+procedural"),
	REPETITION: alternatives("(?:a|em|por)\\s+cada", "outra", "entre"),
	CREATED: alternatives(
		plural("gerad(?:o|a)", "criad(?:o|a)"),
		"e\\s+gerad(?:o|a)",
		"sao\\s+gerad(?:as|os)",
	),
	RANDOM: alternatives(plural("aleatori(?:o|a)"), "aleatoriamente", "de\\s+maneira\\s+aleatoria"),
	EVER_CHANGING: alternatives("em\\s+constante\\s+mudanca", "sempre\\s+mud(?:a|ando)"),
} as const satisfies Record<string, string>;
