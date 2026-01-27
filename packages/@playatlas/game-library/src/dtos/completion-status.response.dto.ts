import { ISODateSchema } from "@playatlas/common/common";
import { completionStatusIdSchema } from "@playatlas/common/domain";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";

export const completionStatusResponseDtoSchema = z.object({
	Id: completionStatusIdSchema,
	Name: z.string(),
	Sync: z.object({
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type CompletionStatusResponseDto = z.infer<typeof completionStatusResponseDtoSchema>;

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	completionStatuses: z.array(completionStatusResponseDtoSchema),
	reason_code: z.enum(["completion_statuses_fetched_successfully"]),
	nextCursor: z.string(),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum(["validation_error"]),
});

export const getCompletionStatusesResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type GetCompletionStatusesResponseDto = z.infer<
	typeof getCompletionStatusesResponseDtoSchema
>;
