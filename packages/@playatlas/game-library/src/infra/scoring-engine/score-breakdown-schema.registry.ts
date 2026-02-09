import type z from "zod";
import {
	SCORE_BREAKDOWN_SCHEMA_V1_0_0,
	SCORE_BREAKDOWN_SCHEMA_V1_1_0,
	canonicalScoreBreakdownSchema,
	scoreBreakdownSchemaMap,
	scoreBreakdownSchemaV1_0_0,
	scoreBreakdownSchemaV1_1_0,
	type ScoreBreakdownSchemaVersion,
} from "../../dtos/scoring-engine/score-breakdown.schema";

type SchemaRegistryEntry = {
	schema: z.ZodSchema<unknown>;
	migrate?: (data: unknown) => unknown;
	next?: ScoreBreakdownSchemaVersion;
};

export const scoreBreakdownSchemaRegistry: Record<
	ScoreBreakdownSchemaVersion,
	SchemaRegistryEntry
> = {
	[SCORE_BREAKDOWN_SCHEMA_V1_0_0]: {
		schema: scoreBreakdownSchemaMap[SCORE_BREAKDOWN_SCHEMA_V1_0_0],
		migrate: (data) => {
			const v1 = data as z.infer<typeof scoreBreakdownSchemaV1_0_0>;
			const v1_1_0: z.infer<typeof scoreBreakdownSchemaV1_1_0> = {
				...v1,
				synergies: [
					{
						contribution: v1.synergy.contribution,
						details: v1.synergy.details,
						type: "multiple_sources",
					},
				],
			};

			return canonicalScoreBreakdownSchema.parse(v1_1_0);
		},
		next: SCORE_BREAKDOWN_SCHEMA_V1_1_0,
	},
	[SCORE_BREAKDOWN_SCHEMA_V1_1_0]: {
		schema: scoreBreakdownSchemaMap[SCORE_BREAKDOWN_SCHEMA_V1_1_0],
	},
};
