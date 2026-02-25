import z from "zod";
import { InvalidStateError } from "../error";

export const tagIdSchema = z.ulid();

export type TagId = string & {
	readonly __brand: "TagId";
};
export const TagIdParser = {
	fromExternal(value: string): TagId {
		if (!tagIdSchema.safeParse(value).success)
			throw new InvalidStateError(`TagId must be a valid ULID`);
		return value as TagId;
	},

	fromTrusted(value: string): TagId {
		return value as TagId;
	},
};
