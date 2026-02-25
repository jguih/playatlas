import z from "zod";
import { InvalidStateError } from "../error";

export const genreIdSchema = z.ulid();

export type GenreId = string & {
	readonly __brand: "GenreId";
};
export const GenreIdParser = {
	fromExternal(value: string): GenreId {
		if (!genreIdSchema.safeParse(value).success)
			throw new InvalidStateError(`GenreId must be a valid ULID`);
		return value as GenreId;
	},

	fromTrusted(value: string): GenreId {
		return value as GenreId;
	},
};
