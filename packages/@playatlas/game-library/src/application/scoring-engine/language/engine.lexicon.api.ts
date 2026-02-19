import { SEP } from "../engine.regexp.utils";

type WithFillerOptions = { n?: number; f?: ScoreEnginePattern; d?: "before" | "after" };

export type ScoreEnginePattern =
	| { type: "literal"; value: string }
	| { type: "alternatives"; children: ScoreEnginePattern[] }
	| { type: "sequence"; children: ScoreEnginePattern[] }
	| { type: "word"; child: ScoreEnginePattern }
	| { type: "plural"; children: ScoreEnginePattern[] }
	| { type: "filler"; child: ScoreEnginePattern; opt?: WithFillerOptions };

export const literal = (value: string): ScoreEnginePattern => ({
	type: "literal",
	value,
});

export const alternatives = (...children: ScoreEnginePattern[]): ScoreEnginePattern => ({
	type: "alternatives",
	children,
});

export const sequence = (...children: ScoreEnginePattern[]): ScoreEnginePattern => ({
	type: "sequence",
	children,
});

export const word = (child: ScoreEnginePattern): ScoreEnginePattern => ({
	type: "word",
	child,
});

export const plural = (...children: ScoreEnginePattern[]): ScoreEnginePattern => ({
	type: "plural",
	children,
});

export const filler = (
	child: ScoreEnginePattern,
	opt: WithFillerOptions = {},
): ScoreEnginePattern => ({
	type: "filler",
	child,
	opt,
});

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
				} satisfies WithFillerOptions;
				const text = compile(pattern.child);
				const filler = compile(options.f);

				if (options.d === "after") return `${text}(?:${SEP}${filler}){0,${options.n}}`;
				else return `(?:${filler}${SEP}){0,${options.n}}${text}`;
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
	};
};
