import { ISODateSchema } from "@playatlas/common/common";
import { playniteGameIdSchema } from "@playatlas/common/domain";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";

export const playniteProjectionResponseDtoSchema = z.object({
	Id: playniteGameIdSchema,
	Name: z.string().nullable(),
	Description: z.string().nullable(),
	ReleaseDate: z.string().nullable(),
	Playtime: z.number(),
	LastActivity: z.string().nullable(),
	Added: z.string().nullable(),
	InstallDirectory: z.string().nullable(),
	IsInstalled: z.number(),
	Hidden: z.number(),
	CompletionStatusId: z.string().nullable(),
	ContentHash: z.string(),
	Developers: z.array(z.string()),
	Publishers: z.array(z.string()),
	Genres: z.array(z.string()),
	Platforms: z.array(z.string()),
	Assets: z.object({
		BackgroundImagePath: z.string().nullable(),
		CoverImagePath: z.string().nullable(),
		IconImagePath: z.string().nullable(),
	}),
	Sync: z.object({
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	games: z.array(playniteProjectionResponseDtoSchema),
	reason_code: z.literal("games_fetched_successfully"),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum(["validation_error"]),
});

export const getGamesResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type PlayniteProjectionResponseDto = z.infer<typeof playniteProjectionResponseDtoSchema>;

export type GetGamesResponseDto = z.infer<typeof getGamesResponseDtoSchema>;
