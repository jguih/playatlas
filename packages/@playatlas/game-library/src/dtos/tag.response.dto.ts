import { ISODateSchema } from "@playatlas/common/common";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";

export const tagResponseDtoSchema = z.object({
	Id: z.string(),
	PlayniteId: z.string().nullable(),
	Name: z.string(),
	Sync: z.object({
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type TagResponseDto = z.infer<typeof tagResponseDtoSchema>;

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	tags: z.array(tagResponseDtoSchema),
	reason_code: z.enum(["tags_fetched_successfully"]),
	nextCursor: z.string(),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum(["validation_error"]),
});

export const getTagsResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type GetTagsResponseDto = z.infer<typeof getTagsResponseDtoSchema>;
