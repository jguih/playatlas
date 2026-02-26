import { defaultFailedResponseDtoSchema } from "@playatlas/common/dtos";
import z from "zod";

const successResponse = z.object({
	success: z.literal(true),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum([
		"invalid_json",
		"validation_error",
		"instance_already_registered",
		"unknown_error",
	]),
});

export const registerInstanceResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type RegisterInstanceResponseDto = z.infer<typeof registerInstanceResponseDtoSchema>;
