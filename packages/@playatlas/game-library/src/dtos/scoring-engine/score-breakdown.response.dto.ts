import z from "zod";
import { canonicalScoreBreakdownSchema } from "./score-breakdown.schema";

const normalizedResponse = z.object({
	type: z.literal("normalized"),
	migrated: z.boolean(),
	breakdown: canonicalScoreBreakdownSchema,
});

const rawResponse = z.object({
	type: z.literal("raw"),
	payload: z.unknown(),
});

export const scoreBreakdownResponseDtoSchema = z.discriminatedUnion("type", [
	normalizedResponse,
	rawResponse,
]);

export type ScoreBreakdownResponseDto = z.infer<typeof scoreBreakdownResponseDtoSchema>;
