import { z } from "zod";
import { InvalidStateError } from "../error";

export const playniteGenreIdSchema = z.string().min(1, "Playnite GenreId cannot be empty");

export type PlayniteGenreId = z.infer<typeof playniteGenreIdSchema> & {
	readonly __brand: "PlayniteGenreId";
};

export const PlayniteGenreIdParser = {
	fromExternal(value: string): PlayniteGenreId {
		if (!value || value.trim() === "")
			throw new InvalidStateError(`Playnite GenreId must not be empty`);
		return value as PlayniteGenreId;
	},

	fromTrusted(value: string): PlayniteGenreId {
		return value as PlayniteGenreId;
	},
};
