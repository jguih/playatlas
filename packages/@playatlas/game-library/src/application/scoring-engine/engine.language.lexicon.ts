export const plural = (...words: string[]): string => `(?:${words.join("|")})s?`;

export const alternatives = (...groups: string[]) => `(?:${groups.flat().join("|")})\\b`;
