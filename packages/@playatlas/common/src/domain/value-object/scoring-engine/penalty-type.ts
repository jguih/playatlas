export const penaltyType = [
	"no_gate",
	"multiple_gates",
	"tags_only",
	"evidence_stacking",
] as const satisfies string[];

export type PenaltyType = (typeof penaltyType)[number];
