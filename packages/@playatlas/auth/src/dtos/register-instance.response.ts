import { defaultFailedResponseDtoSchema } from "@playatlas/common/dtos";
import z from "zod";

const successResponse = z.object({
	success: z.literal(true),
});

export const registerInstanceResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	defaultFailedResponseDtoSchema,
]);

export type RegisterInstanceResponseDto = z.infer<typeof registerInstanceResponseDtoSchema>;
