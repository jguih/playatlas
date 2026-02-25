export const evidenceSource = ["text", "genre", "tag"] as const satisfies string[];

export type EvidenceSource = (typeof evidenceSource)[number];
