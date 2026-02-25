export type GameId = string & { readonly __brand: "GameId" };

export const GameIdParser = {
	fromTrusted: (value: string) => value as GameId,
};
