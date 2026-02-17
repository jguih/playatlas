export const plural = (...words: string[]): string => `(?:${words.join("|")})s?`;

export const alternatives = (...groups: string[]) => `\\b(?:${groups.flat().join("|")})\\b`;
