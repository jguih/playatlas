export const canonicalClassificationThresholdTiers = [
	"adjacent",
	"strong",
	"core",
] as const satisfies string[];

export type CanonicalClassificationThresholdTier =
	(typeof canonicalClassificationThresholdTiers)[number];

// MUST be ordered by weakest tier first -> greatest tier last.
export const canonicalClassificationTiers = [
	"none",
	"weak",
	...canonicalClassificationThresholdTiers,
] as const satisfies string[];

export type CanonicalClassificationTier = (typeof canonicalClassificationTiers)[number];
