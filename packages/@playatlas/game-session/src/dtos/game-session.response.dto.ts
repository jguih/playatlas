import { ISODateSchema } from "@playatlas/common/common";
import { gameSessionStatus } from "@playatlas/common/domain";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";

export const gameSessionResponseDtoSchema = z.object({
	SessionId: z.string(),
	GameId: z.string(),
	GameName: z.string().nullable(),
	StartTime: z.string(),
	EndTime: z.string().nullable(),
	Duration: z.number().nullable(),
	Status: z.enum(gameSessionStatus),
	Sync: z.object({
		CreatedAt: ISODateSchema,
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type GameSessionResponseDto = z.infer<typeof gameSessionResponseDtoSchema>;

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	gameSessions: z.array(gameSessionResponseDtoSchema),
	reason_code: z.enum(["game_sessions_fetched_successfully"]),
	nextCursor: z.string(),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum(["validation_error"]),
});

export const getGameSessionsResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type GetGameSessionsResponseDto = z.infer<typeof getGameSessionsResponseDtoSchema>;
