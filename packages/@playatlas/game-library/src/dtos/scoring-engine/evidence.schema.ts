import { evidenceSource, evidenceTier, storedEvidenceStatus } from "@playatlas/common/domain";
import z from "zod";

export const evidenceSchema = z.object({
	source: z.enum(evidenceSource),
	sourceHint: z.string().optional(),
	match: z.string().or(z.number()),
	weight: z.number(),
	group: z.string(),
	tier: z.enum(evidenceTier),
	isGate: z.boolean(),
});

export const storedEvidenceSchema = evidenceSchema.extend({
	status: z.enum(storedEvidenceStatus),
	contribution: z.number(),
});
