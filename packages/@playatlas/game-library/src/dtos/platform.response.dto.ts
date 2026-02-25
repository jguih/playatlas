import { ISODateSchema } from "@playatlas/common/common";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";

export const platformResponseDtoSchema = z.object({
	Id: z.string(),
	Name: z.string(),
	Playnite: z.object({
		Id: z.string().nullable(),
		SpecificationId: z.string().nullable(),
	}),
	Sync: z.object({
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type PlatformResponseDto = z.infer<typeof platformResponseDtoSchema>;

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	platforms: z.array(platformResponseDtoSchema),
	reason_code: z.enum(["platforms_fetched_successfully"]),
	nextCursor: z.string(),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum(["validation_error"]),
});

export const getPlatformsResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type GetPlatformResponseDto = z.infer<typeof getPlatformsResponseDtoSchema>;
