import { ISODateSchema } from "@playatlas/common/common";
import {
	classificationIdSchema,
	engineScoreMode,
	gameClassificationIdSchema,
	gameIdSchema,
} from "@playatlas/common/domain";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";
import { scoreBreakdownResponseDtoSchema } from "./scoring-engine/score-breakdown.response.dto";

export const gameClassificationResponseDtoSchema = z.object({
	Id: gameClassificationIdSchema,
	GameId: gameIdSchema,
	ClassificationId: classificationIdSchema,
	Score: z.number(),
	NormalizedScore: z.number(),
	ScoreMode: z.enum(engineScoreMode),
	Breakdown: scoreBreakdownResponseDtoSchema,
	Sync: z.object({
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type GameClassificationResponseDto = z.infer<typeof gameClassificationResponseDtoSchema>;

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	gameClassifications: z.array(gameClassificationResponseDtoSchema),
	reason_code: z.enum(["game_classifications_fetched_successfully"]),
	nextCursor: z.string(),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum(["validation_error"]),
});

export const getGameClassificationsResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type GetGameClassificationsResponseDto = z.infer<
	typeof getGameClassificationsResponseDtoSchema
>;
