export const evidenceGroupThresholdTiers = [
	"light",
	"moderate",
	"strong",
] as const satisfies string[];

export type EvidenceGroupThresholdTier = (typeof evidenceGroupThresholdTiers)[number];

export const evidenceGroupTiers = [
	"none",
	...evidenceGroupThresholdTiers,
] as const satisfies string[];

export type EvidenceGroupTier = (typeof evidenceGroupTiers)[number];
