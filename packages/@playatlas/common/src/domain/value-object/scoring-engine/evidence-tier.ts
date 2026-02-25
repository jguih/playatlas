export const evidenceTier = ["A", "B", "C"] as const satisfies string[];

export type EvidenceTier = (typeof evidenceTier)[number];
