export const SEP = `(?:\\s+|[,.!?;:—-]+\\s*)`;

export const FILLER = (n: number) => `(?:${SEP}\\w+){0,${n}}`;

export const VERB = (v: string) => `${v}(?:s|ed|ing)?\\b`;
