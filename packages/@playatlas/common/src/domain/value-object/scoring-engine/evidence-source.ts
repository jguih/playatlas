export const evidenceSource = ["taxonomy", "text"] as const satisfies string[];

export type EvidenceSource = (typeof evidenceSource)[number];
