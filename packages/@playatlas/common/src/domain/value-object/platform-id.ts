import z from "zod";
import { InvalidStateError } from "../error";

export const platformIdSchema = z.string().min(1, "PlatformId cannot be empty");

export type PlatformId = string & {
	readonly __brand: "PlatformId";
};

export const PlatformIdParser = {
	fromExternal(value: string): PlatformId {
		if (!value || value.trim() === "") throw new InvalidStateError(`PlatformId must not be empty`);
		return value as PlatformId;
	},

	fromTrusted(value: string): PlatformId {
		return value as PlatformId;
	},
};
