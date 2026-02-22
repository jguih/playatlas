export const evidenceGroupThresholdTiers = ["moderate", "strong"] as const satisfies string[];

export type EvidenceGroupThresholdTier = (typeof evidenceGroupThresholdTiers)[number];

// MUST be ordered by weakest tier first -> greatest tier last.
export const evidenceGroupTiers = [
	"none",
	"light",
	...evidenceGroupThresholdTiers,
] as const satisfies string[];

export type EvidenceGroupTier = (typeof evidenceGroupTiers)[number];
