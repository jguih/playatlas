import { ISODateSchema } from "@playatlas/common/common";
import { classificationCategorySchema, classificationIdSchema } from "@playatlas/common/domain";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";

export const classificationResponseDtoSchema = z.object({
	Id: classificationIdSchema,
	DisplayName: z.string().min(1),
	Category: classificationCategorySchema,
	Description: z.string().min(1),
	Version: z.string().min(1),
	Sync: z.object({
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type ClassificationResponseDto = z.infer<typeof classificationResponseDtoSchema>;

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	classifications: z.array(classificationResponseDtoSchema),
	reason_code: z.enum(["classifications_fetched_successfully"]),
	nextCursor: z.string(),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum(["validation_error"]),
});

export const getClassificationsResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type GetClassificationsResponseDto = z.infer<typeof getClassificationsResponseDtoSchema>;
