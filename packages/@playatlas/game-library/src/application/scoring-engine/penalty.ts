import z from "zod";

const penaltyType = ["no_gate", "multiple_gates"] as const satisfies string[];

export type Penalty = {
	type: (typeof penaltyType)[number];
	contribution: number;
	details: string;
};

export const penaltySchema = z.object({
	Type: z.enum(penaltyType),
	Contribution: z.number(),
	Details: z.string(),
});
