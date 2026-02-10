export type GameLibraryFilterId = string & { readonly __brand: "GameLibraryFilterId" };

export const GameLibraryFilterIdParser = {
	fromTrusted: (value: string) => value as GameLibraryFilterId,
};
