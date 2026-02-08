export const penaltyType = ["no_gate", "multiple_gates"] as const satisfies string[];

export type PenaltyType = (typeof penaltyType)[number];
