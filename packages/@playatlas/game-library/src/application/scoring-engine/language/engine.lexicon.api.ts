export type FillerOptions = { n?: number; f?: ScoreEnginePattern; d?: "before" | "after" };

export type ScoreEnginePattern =
	| { type: "literal"; value: string }
	| { type: "alternatives"; children: ScoreEnginePattern[] }
	| { type: "sequence"; children: ScoreEnginePattern[] }
	| { type: "word"; child: ScoreEnginePattern }
	| { type: "plural"; children: ScoreEnginePattern[] }
	| { type: "filler"; child: ScoreEnginePattern; opt?: FillerOptions }
	| { type: "window"; children: ScoreEnginePattern[]; size: number };

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

export const filler = (child: ScoreEnginePattern, opt: FillerOptions = {}): ScoreEnginePattern => ({
	type: "filler",
	child,
	opt,
});

export const window = (size: number, ...children: ScoreEnginePattern[]): ScoreEnginePattern => ({
	type: "window",
	children,
	size,
});
