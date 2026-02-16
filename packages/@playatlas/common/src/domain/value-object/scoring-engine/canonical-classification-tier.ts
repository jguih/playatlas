export const canonicalClassificationThresholdTiers = [
	"adjacent",
	"strong",
	"core",
] as const satisfies string[];

export type CanonicalClassificationThresholdTier =
	(typeof canonicalClassificationThresholdTiers)[number];

export const canonicalClassificationTiers = [
	"none",
	"weak",
	...canonicalClassificationThresholdTiers,
] as const satisfies string[];

export type CanonicalClassificationTier = (typeof canonicalClassificationTiers)[number];
