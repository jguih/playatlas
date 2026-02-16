import { canonicalClassificationTiers, engineScoreMode } from "@playatlas/common/domain";
import z from "zod";
import { storedEvidenceSchema } from "./evidence.schema";
import { penaltySchema } from "./penalty.schema";
import { synergySchema } from "./synergy.schema";

type SchemaVersionType = string;

// #region: Schema versions
export const SCORE_BREAKDOWN_SCHEMA_V1_2_0 = "v1.2.0" as const satisfies SchemaVersionType;
export const SCORE_BREAKDOWN_SCHEMA_V1_1_0 = "v1.1.0" as const satisfies SchemaVersionType;
export const SCORE_BREAKDOWN_SCHEMA_V1_0_0 = "v1.0.0" as const satisfies SchemaVersionType;
// #endregion

// #region: Individual schemas
export const scoreBreakdownSchemaV1_2_0 = z.object({
	mode: z.enum(engineScoreMode),
	groups: z.array(
		z.object({
			group: z.string(),
			evidences: z.array(storedEvidenceSchema),
			contribution: z.number(),
			contributionPercent: z.number(),
		}),
	),
	synergies: z.array(synergySchema),
	subtotal: z.number(),
	penalties: z.array(penaltySchema),
	total: z.number(),
	normalizedTotal: z.number(),
	tier: z.enum(canonicalClassificationTiers),
});

export const scoreBreakdownSchemaV1_1_0 = z.object({
	mode: z.enum(engineScoreMode),
	groups: z.array(
		z.object({
			group: z.string(),
			evidences: z.array(storedEvidenceSchema),
			contribution: z.number(),
		}),
	),
	synergies: z.array(synergySchema),
	subtotal: z.number(),
	penalties: z.array(penaltySchema),
	total: z.number(),
});

export const scoreBreakdownSchemaV1_0_0 = z.object({
	mode: z.enum(engineScoreMode),
	groups: z.array(
		z.object({
			group: z.string(),
			evidences: z.array(storedEvidenceSchema),
			contribution: z.number(),
		}),
	),
	synergy: z.object({
		contribution: z.number(),
		details: z.string(),
	}),
	subtotal: z.number(),
	penalties: z.array(penaltySchema),
	total: z.number(),
});
// #endregion

// #region: Schema map
export const scoreBreakdownSchemaMap = {
	[SCORE_BREAKDOWN_SCHEMA_V1_2_0]: scoreBreakdownSchemaV1_2_0,
	[SCORE_BREAKDOWN_SCHEMA_V1_1_0]: scoreBreakdownSchemaV1_1_0,
	[SCORE_BREAKDOWN_SCHEMA_V1_0_0]: scoreBreakdownSchemaV1_0_0,
} as const;
// #endregion

export type ScoreBreakdownSchemaVersion = keyof typeof scoreBreakdownSchemaMap;

export const LATEST_SCORE_BREAKDOWN_SCHEMA_VERSION =
	SCORE_BREAKDOWN_SCHEMA_V1_2_0 satisfies SchemaVersionType;

export const canonicalScoreBreakdownSchema =
	scoreBreakdownSchemaMap[LATEST_SCORE_BREAKDOWN_SCHEMA_VERSION];

export type CanonicalScoreBreakdown = z.infer<typeof canonicalScoreBreakdownSchema>;
