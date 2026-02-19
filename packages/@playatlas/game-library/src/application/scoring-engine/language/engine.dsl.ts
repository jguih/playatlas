import { SEP } from "../engine.regexp.utils";
import { literal, type FillerOptions, type ScoreEnginePattern } from "./engine.lexicon.api";

export const makeScoreEngineDSL = () => {
	const normalize = (pattern: ScoreEnginePattern): ScoreEnginePattern => {
		if (pattern.type === "alternatives") {
			const flattened: ScoreEnginePattern[] = [];

			for (const child of pattern.children) {
				const normalizedChild = normalize(child);

				if (normalizedChild.type === "alternatives") {
					flattened.push(...normalizedChild.children);
				} else {
					flattened.push(normalizedChild);
				}
			}

			return { type: "alternatives", children: flattened };
		}

		if (pattern.type === "sequence") {
			return {
				type: "sequence",
				children: pattern.children.map(normalize),
			};
		}

		return pattern;
	};

	const compile = (pattern: ScoreEnginePattern): string => {
		switch (pattern.type) {
			case "literal":
				return pattern.value;

			case "alternatives":
				return `(?:${pattern.children.map(compile).join("|")})`;

			case "sequence":
				return pattern.children.map(compile).join(SEP);

			case "plural":
				return `(?:${pattern.children.map(compile).join("|")})s?`;

			case "filler": {
				const options = {
					n: 1,
					f: literal("\\w+"),
					d: "after",
					...pattern.opt,
				} satisfies FillerOptions;
				const text = compile(pattern.child);
				const filler = compile(options.f);

				if (options.d === "after") return `${text}(?:${SEP}${filler}){0,${options.n}}`;
				else return `(?:${filler}${SEP}){0,${options.n}}${text}`;
			}

			case "window": {
				const lookaheads = pattern.children
					.map(compile)
					.map((t) => `(?=.{0,${pattern.size}}${t})`)
					.join("");
				return `${lookaheads}.{0,${pattern.size}}`;
			}

			case "word": {
				const inner = compile(pattern.child);
				return `${inner}\\b`;
			}
		}
	};

	return {
		normalize,
		compile,
		normalizeCompile: (pattern: ScoreEnginePattern) => compile(normalize(pattern)),
	};
};
