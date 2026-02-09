import { synergyType } from "@playatlas/common/domain";
import z from "zod";

export const synergySchema = z.object({
	type: z.enum(synergyType),
	contribution: z.number(),
	details: z.string(),
});
