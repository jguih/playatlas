import { SEP } from "./engine.regexp.utils";

export const sequence = (...parts: string[]) => new RegExp(parts.join(SEP), "i");

type WithFillerOptions = { n?: number; f?: string; d?: "before" | "after" };

export const filler = (a: string, opt: WithFillerOptions = {}) => {
	const options = {
		n: 1,
		f: "\\w+",
		d: "after",
		...opt,
	} satisfies WithFillerOptions;

	if (options.d === "after") return `${a}(?:${SEP}${options.f}){0,${options.n}}`;
	else return `(?:${options.f}${SEP}){0,${options.n}}${a}`;
};

export type ScoreEnginePatternDictionary = Record<string, RegExp>;

export const window = (terms: string[], size: number) => {
	const lookaheads = terms.map((t) => `(?=.{0,${size}}${t})`).join("");
	return new RegExp(`${lookaheads}.{0,${size}}`, "i");
};

export const anyOf = (...patterns: RegExp[]): RegExp => {
	if (patterns.length === 0) {
		throw new Error("anyOf requires at least one pattern");
	}

	const flags = patterns[0].flags;

	for (const p of patterns) {
		if (p.flags !== flags) {
			throw new Error("All patterns passed to anyOf must have identical flags");
		}
	}

	const source = patterns.map((p) => `(?:${p.source})`).join("|");

	return new RegExp(source, flags);
};
