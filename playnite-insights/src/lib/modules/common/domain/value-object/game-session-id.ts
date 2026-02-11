export type GameSessionId = string & {
	readonly __brand: "GameSessionId";
};

export const GameSessionIdParser = {
	fromTrusted: (value: string) => value as GameSessionId,
};
