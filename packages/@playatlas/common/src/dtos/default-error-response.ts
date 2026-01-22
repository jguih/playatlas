import z from "zod";

export const defaultFailedResponseDtoSchema = z.object({
	success: z.literal(false),
	reason: z.string(),
	reason_code: z.string().optional(),
	details: z.any().optional(),
});
