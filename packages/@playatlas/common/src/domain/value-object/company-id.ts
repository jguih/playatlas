import z from "zod";
import { InvalidStateError } from "../error";

export const companyIdSchema = z.string().min(1, "CompanyId cannot be empty");

export type CompanyId = string & {
	readonly __brand: "CompanyId";
};
export const CompanyIdParser = {
	fromExternal(value: string): CompanyId {
		const { success, data, error } = companyIdSchema.safeParse(value);
		if (success) return data as CompanyId;
		throw new InvalidStateError(`Invalid Company Id: \n${error.issues}`);
	},

	fromTrusted(value: string): CompanyId {
		return value as CompanyId;
	},
};
