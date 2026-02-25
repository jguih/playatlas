export type GameClassificationId = string & { readonly __brand: "GameClassificationId" };

export const GameClassificationIdParser = {
	fromTrusted: (value: string) => value as GameClassificationId,
};
