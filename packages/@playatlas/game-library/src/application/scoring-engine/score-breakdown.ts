import z from "zod";
import { storedEvidenceSchema, type StoredEvidence } from "./evidence";
import { penaltySchema, type Penalty } from "./penalty";

export const scoreBreakdownSchema = z.object({
	mode: z.enum(["with_gate", "without_gate"]),
	groups: z.array(
		z.object({
			group: z.string(),
			evidences: z.array(storedEvidenceSchema),
			contribution: z.number(),
		}),
	),
	synergy: z.object({
		contribution: z.number(),
		details: z.string(),
	}),
	subtotal: z.number(),
	penalties: z.array(penaltySchema),
	total: z.number(),
});

export type ScoreBreakdown<TGroup> = {
	mode: "with_gate" | "without_gate";
	groups: {
		group: TGroup;
		evidences: StoredEvidence<TGroup>[];
		contribution: number;
	}[];
	synergy: {
		contribution: number;
		details: string;
	};
	subtotal: number;
	penalties: Array<Penalty>;
	total: number;
};
