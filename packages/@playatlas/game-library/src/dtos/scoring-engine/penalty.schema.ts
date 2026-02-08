import { penaltyType } from "@playatlas/common/domain";
import z from "zod";

export const penaltySchema = z.object({
	Type: z.enum(penaltyType),
	Contribution: z.number(),
	Details: z.string(),
});
