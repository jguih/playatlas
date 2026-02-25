import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";
import { instanceSessionIdSchema } from "../domain";

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	sessionId: instanceSessionIdSchema,
	reason_code: z.literal("login_successful"),
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum([
		"invalid_json",
		"validation_error",
		"instance_not_registered",
		"login_failed",
		"unknown_error",
	]),
});

export const loginInstanceResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type LoginInstanceResponseDto = z.infer<typeof loginInstanceResponseDtoSchema>;
