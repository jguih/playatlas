import z from "zod";
import { InvalidStateError } from "../error";

export const completionStatusIdSchema = z.string().min(1, "CompletionStatusId cannot be empty");

export type CompletionStatusId = string & {
	readonly __brand: "CompletionStatusId";
};

export const CompletionStatusIdParser = {
	fromExternal(value: string): CompletionStatusId {
		const { success, data, error } = completionStatusIdSchema.safeParse(value);
		if (success) return data as CompletionStatusId;
		throw new InvalidStateError(`Invalid Completion Status Id: \n${error.issues}`);
	},

	fromTrusted(value: string): CompletionStatusId {
		return value as CompletionStatusId;
	},
};
