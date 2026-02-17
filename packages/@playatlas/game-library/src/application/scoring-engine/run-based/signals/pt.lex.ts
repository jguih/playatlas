import { alternatives, plural } from "../../engine.language.lex";

export const LEX = {
	RUN: alternatives(
		plural("run", "loop", "ciclo", "playthrough", "jornada", "aventura", "partida", "tentativa"),
		"sess(?:ao|oes)",
	),
	RESTART: alternatives("recomecar", "reiniciar"),
	LOOP: alternatives("toda\\s+vez\\s+que", "sempre\\s+que", "sempre", "quando"),
	WORLD: alternatives(
		plural("mapa", "mundo", "level", "masmorra", "planeta", "ambiente", "castelo"),
		"nive(?:l|is)",
	),
	DEATH: alternatives("falhar", "morr(?:e|er|eu|endo|ia)"),
	PROCEDURAL: alternatives(`proceduralmente`),
	REPETITION: alternatives(`(?:a|em|por)\\s+cada`, "outra", "entre"),
};
