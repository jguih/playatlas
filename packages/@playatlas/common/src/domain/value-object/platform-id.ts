import z from "zod";
import { InvalidStateError } from "../error";

export const platformIdSchema = z.string().min(1, "PlatformId cannot be empty");

export type PlatformId = string & {
	readonly __brand: "PlatformId";
};

export const PlatformIdParser = {
	fromExternal(value: string): PlatformId {
		const { success, data, error } = platformIdSchema.safeParse(value);
		if (success) return data as PlatformId;
		throw new InvalidStateError(`Invalid Platform Id: \n${error.issues}`);
	},

	fromTrusted(value: string): PlatformId {
		return value as PlatformId;
	},
};
