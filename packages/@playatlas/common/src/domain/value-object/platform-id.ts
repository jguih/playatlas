import z from "zod";
import { InvalidStateError } from "../error";

export const platformIdSchema = z.ulid();

export type PlatformId = string & {
	readonly __brand: "PlatformId";
};

export const PlatformIdParser = {
	fromExternal(value: string): PlatformId {
		if (!platformIdSchema.safeParse(value).success)
			throw new InvalidStateError(`PlatformId must be a valid ULID`);
		return value as PlatformId;
	},

	fromTrusted(value: string): PlatformId {
		return value as PlatformId;
	},
};
