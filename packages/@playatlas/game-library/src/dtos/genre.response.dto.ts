import { ISODateSchema } from "@playatlas/common/common";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";

export const genreResponseDtoSchema = z.object({
	Id: z.string(),
	PlayniteId: z.string().nullable(),
	Name: z.string(),
	Sync: z.object({
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type GenreResponseDto = z.infer<typeof genreResponseDtoSchema>;

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	genres: z.array(genreResponseDtoSchema),
	reason_code: z.enum(["genres_fetched_successfully"]),
	nextCursor: z.string(),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum(["validation_error"]),
});

export const getGenresResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type GetGenresResponseDto = z.infer<typeof getGenresResponseDtoSchema>;
