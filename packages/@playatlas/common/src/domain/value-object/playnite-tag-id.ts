import { z } from "zod";
import { InvalidStateError } from "../error";

export const playniteTagIdSchema = z.string().min(1, "Playnite TagId cannot be empty");

export type PlayniteTagId = z.infer<typeof playniteTagIdSchema> & {
	readonly __brand: "PlayniteTagId";
};

export const PlayniteTagIdParser = {
	fromExternal(value: string): PlayniteTagId {
		if (!value || value.trim() === "")
			throw new InvalidStateError(`Playnite TagId must not be empty`);
		return value as PlayniteTagId;
	},

	fromTrusted(value: string): PlayniteTagId {
		return value as PlayniteTagId;
	},
};
