import { penaltyType } from "@playatlas/common/domain";
import z from "zod";

export const penaltySchema = z.object({
	type: z.enum(penaltyType),
	contribution: z.number(),
	details: z.string(),
});
