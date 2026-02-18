import { SEP } from "./engine.regexp.utils";

export const sequence = (...parts: string[]) => new RegExp(parts.join(SEP), "i");

type WithFillerOptions = { n?: number; f?: string };

export const filler = (a: string, opt: WithFillerOptions = {}) => {
	const options = {
		n: 1,
		f: "\\w+",
		...opt,
	} satisfies WithFillerOptions;

	return `${a}(?:${SEP}${options.f}){0,${options.n}}`;
};
