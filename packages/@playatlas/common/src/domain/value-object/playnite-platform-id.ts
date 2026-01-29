import { z } from "zod";
import { InvalidStateError } from "../error";

export const playnitePlatformIdSchema = z.string().min(1, "Playnite PlatformId cannot be empty");

export type PlaynitePlatformId = z.infer<typeof playnitePlatformIdSchema> & {
	readonly __brand: "PlaynitePlatformId";
};

export const PlaynitePlatformIdParser = {
	fromExternal(value: string): PlaynitePlatformId {
		if (!value || value.trim() === "")
			throw new InvalidStateError(`Playnite PlatformId must not be empty`);
		return value as PlaynitePlatformId;
	},

	fromTrusted(value: string): PlaynitePlatformId {
		return value as PlaynitePlatformId;
	},
};
