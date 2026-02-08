import z from "zod";
import {
	scoreBreakdownSchemaMap,
	type ScoreBreakdownSchemaVersion,
} from "../../dtos/scoring-engine/score-breakdown.schema";

const versionEnum = z.enum(
	Object.keys(scoreBreakdownSchemaMap) as [
		ScoreBreakdownSchemaVersion,
		...ScoreBreakdownSchemaVersion[],
	],
);

export const scoreBreakdownEnvelopeSchema = z.object({
	breakdownSchemaVersion: versionEnum,
	payload: z.unknown(),
});

export type ScoreBreakdownEnvelope = z.infer<typeof scoreBreakdownEnvelopeSchema>;
