import { z } from "zod";
import { InvalidStateError } from "../error";

export const playniteGameIdSchema = z.string().min(1, "Playnite GameId cannot be empty");

export type PlayniteGameId = z.infer<typeof playniteGameIdSchema> & {
	readonly __brand: "PlayniteGameId";
};

export const PlayniteGameIdParser = {
	fromExternal(value: string): PlayniteGameId {
		if (!value || value.trim() === "")
			throw new InvalidStateError(`Playnite GameId must not be empty`);
		return value as PlayniteGameId;
	},

	fromTrusted(value: string): PlayniteGameId {
		return value as PlayniteGameId;
	},
};
