import { ISODateSchema } from "@playatlas/common/common";
import {
	defaultFailedResponseDtoSchema,
	defaultSuccessResponseDtoSchema,
} from "@playatlas/common/dtos";
import z from "zod";

export const companyResponseDtoSchema = z.object({
	Id: z.string(),
	Name: z.string(),
	Sync: z.object({
		LastUpdatedAt: ISODateSchema,
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type CompanyResponseDto = z.infer<typeof companyResponseDtoSchema>;

const successResponse = z.object({
	...defaultSuccessResponseDtoSchema.shape,
	companies: z.array(companyResponseDtoSchema),
	reason_code: z.enum(["companies_fetched_successfully"]),
	nextCursor: ISODateSchema,
});

const failedResponse = z.object({
	...defaultFailedResponseDtoSchema.shape,
	reason_code: z.enum(["validation_error"]),
});

export const getCompaniesResponseDtoSchema = z.discriminatedUnion("success", [
	successResponse,
	failedResponse,
]);

export type GetCompaniesResponseDto = z.infer<typeof getCompaniesResponseDtoSchema>;
