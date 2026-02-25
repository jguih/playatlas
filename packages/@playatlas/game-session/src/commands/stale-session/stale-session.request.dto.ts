import { ISODateSchema } from "@playatlas/common/common";
import z from "zod";

export const staleGameSessionRequestDtoSchema = z.object({
	ClientUtcNow: ISODateSchema,
	SessionId: z.string(),
	GameId: z.string(),
	StartTime: ISODateSchema,
	EndTime: ISODateSchema.optional().nullable(),
	Duration: z.number().optional().nullable(),
});

export type StaleGameSessionRequestDto = z.infer<typeof staleGameSessionRequestDtoSchema>;
