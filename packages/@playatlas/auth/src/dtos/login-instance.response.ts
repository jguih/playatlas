import { defaultFailedResponseDtoSchema } from "@playatlas/common/dtos";
import z from "zod";
import { instanceSessionIdSchema } from "../domain";

const successResponse = z.object({
	success: z.literal(true),
	sessionId: instanceSessionIdSchema,
});

export const loginInstanceResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	defaultFailedResponseDtoSchema,
]);

export type LoginInstanceResponseDto = z.infer<typeof loginInstanceResponseDtoSchema>;
