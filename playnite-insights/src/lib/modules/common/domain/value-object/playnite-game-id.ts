export type PlayniteGameId = string & { readonly __brand: "PlayniteGameId" };

export const PlayniteGameIdParser = {
	fromTrusted: (value: string) => value as PlayniteGameId,
};
