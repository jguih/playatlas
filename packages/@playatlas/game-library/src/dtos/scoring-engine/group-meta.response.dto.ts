import { evidenceGroupRole } from "@playatlas/common/domain";
import z from "zod";

const evidenceGroupMetaSchema = z.object({
	userFacing: z.boolean(),
	role: z.enum(evidenceGroupRole),
});

export const evidenceGroupMetaResponseDtoSchema = z.record(z.string(), evidenceGroupMetaSchema);
