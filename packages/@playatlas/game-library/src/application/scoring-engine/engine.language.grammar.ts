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
