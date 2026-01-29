import z from "zod";
import { InvalidStateError } from "../error";

export const companyIdSchema = z.string().min(1, "CompanyId cannot be empty").ulid();

export type CompanyId = string & {
	readonly __brand: "CompanyId";
};
export const CompanyIdParser = {
	fromExternal(value: string): CompanyId {
		if (!value || value.trim() === "") throw new InvalidStateError(`CompanyId must not be empty`);
		return value as CompanyId;
	},

	fromTrusted(value: string): CompanyId {
		return value as CompanyId;
	},
};
