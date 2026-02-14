export const penaltyType = ["no_gate", "multiple_gates", "tags_only"] as const satisfies string[];

export type PenaltyType = (typeof penaltyType)[number];
