import type z from "zod";
import {
	SCORE_BREAKDOWN_SCHEMA_V1_0_0,
	SCORE_BREAKDOWN_SCHEMA_V1_1_0,
	SCORE_BREAKDOWN_SCHEMA_V1_2_0,
	SCORE_BREAKDOWN_SCHEMA_V1_3_0,
	scoreBreakdownSchemaMap,
	scoreBreakdownSchemaV1_0_0,
	scoreBreakdownSchemaV1_1_0,
	scoreBreakdownSchemaV1_2_0,
	scoreBreakdownSchemaV1_3_0,
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

			return scoreBreakdownSchemaV1_1_0.parse(v1_1_0);
		},
		next: SCORE_BREAKDOWN_SCHEMA_V1_1_0,
	},
	[SCORE_BREAKDOWN_SCHEMA_V1_1_0]: {
		schema: scoreBreakdownSchemaMap[SCORE_BREAKDOWN_SCHEMA_V1_1_0],
		migrate: (data) => {
			const v1_1_0 = data as z.infer<typeof scoreBreakdownSchemaV1_1_0>;
			const v1_2_0: z.infer<typeof scoreBreakdownSchemaV1_2_0> = {
				...v1_1_0,
				groups: v1_1_0.groups.map((g) => ({ ...g, contributionPercent: 0 })),
				normalizedTotal: v1_1_0.total,
				tier: "none",
			};

			return scoreBreakdownSchemaV1_2_0.parse(v1_2_0);
		},
		next: SCORE_BREAKDOWN_SCHEMA_V1_2_0,
	},
	[SCORE_BREAKDOWN_SCHEMA_V1_2_0]: {
		schema: scoreBreakdownSchemaMap[SCORE_BREAKDOWN_SCHEMA_V1_2_0],
		migrate: (data) => {
			const v1_2_0 = data as z.infer<typeof scoreBreakdownSchemaV1_2_0>;
			const v1_3_0: z.infer<typeof scoreBreakdownSchemaV1_3_0> = {
				...v1_2_0,
				groups: v1_2_0.groups.map((g) => ({ ...g, normalizedContribution: 0, tier: "none" })),
			};

			return scoreBreakdownSchemaV1_3_0.parse(v1_3_0);
		},
		next: SCORE_BREAKDOWN_SCHEMA_V1_3_0,
	},
	[SCORE_BREAKDOWN_SCHEMA_V1_3_0]: {
		schema: scoreBreakdownSchemaMap[SCORE_BREAKDOWN_SCHEMA_V1_3_0],
	},
};
