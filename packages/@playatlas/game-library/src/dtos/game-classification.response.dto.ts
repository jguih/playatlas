import { ISODateSchema } from "@playatlas/common/common";
import {
	classificationIdSchema,
	gameClassificationIdSchema,
	gameIdSchema,
} from "@playatlas/common/domain";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";
import { scoreBreakdownSchema } from "../application/scoring-engine/score-breakdown";

export const gameClassificationResponseDtoSchema = z.object({
	Id: gameClassificationIdSchema,
	GameId: gameIdSchema,
	ClassificationId: classificationIdSchema,
	Breakdown: scoreBreakdownSchema,
	Sync: z.object({
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type GameClassificationResponseDto = z.infer<typeof gameClassificationIdSchema>;

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
