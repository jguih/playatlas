import z from "zod";

export const scoreBreakdownEnvelopeSchema = z.object({
	breakdownSchemaVersion: z.string(),
	payload: z.unknown(),
});

export type ScoreBreakdownEnvelope = z.infer<typeof scoreBreakdownEnvelopeSchema>;
