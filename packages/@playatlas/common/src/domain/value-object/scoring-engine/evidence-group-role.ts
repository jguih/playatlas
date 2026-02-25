export const evidenceGroupRole = ["identity", "dimension"] as const satisfies string[];

export type EvidenceGroupRole = (typeof evidenceGroupRole)[number];
