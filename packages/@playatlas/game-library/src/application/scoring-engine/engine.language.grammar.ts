import { SEP } from "./engine.regexp.utils";

export const seq = (...parts: string[]) => new RegExp(parts.join(SEP), "i");

type WithFillerOptions = { n?: number; f?: string };

export const withFiller = (a: string, opt: WithFillerOptions = {}) => {
	const options = {
		n: 1,
		f: "\\w+",
		...opt,
	} satisfies WithFillerOptions;

	return `${a}(?:${SEP}${options.f}){0,${options.n}}`;
};
