import z from "zod";

export const loginInstanceRequestDtoSchema = z.object({
	password: z.string(),
});

export type LoginInstanceRequestDto = z.infer<typeof loginInstanceRequestDtoSchema>;
