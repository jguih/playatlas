import { ISODateSchema } from "@playatlas/common/common";
import { completionStatusIdSchema } from "@playatlas/common/domain";
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
