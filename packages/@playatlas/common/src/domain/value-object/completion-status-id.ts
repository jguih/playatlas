import z from "zod";
import { InvalidStateError } from "../error";

export const completionStatusIdSchema = z
	.string()
	.min(1, "CompletionStatusId cannot be empty")
	.ulid();

export type CompletionStatusId = string & {
	readonly __brand: "CompletionStatusId";
};

export const CompletionStatusIdParser = {
	fromExternal(value: string): CompletionStatusId {
		if (!value || value.trim() === "")
			throw new InvalidStateError(`CompletionStatusId must not be empty`);
		return value as CompletionStatusId;
	},

	fromTrusted(value: string): CompletionStatusId {
		return value as CompletionStatusId;
	},
};
