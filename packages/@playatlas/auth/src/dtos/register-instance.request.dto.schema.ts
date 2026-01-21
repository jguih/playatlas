import z from "zod";

export const registerInstanceRequestDtoSchema = z.object({
	password: z.string().min(4, "Instance password must have at least 4 characters"),
});

export type RegisterInstanceRequestDto = z.infer<typeof registerInstanceRequestDtoSchema>;
