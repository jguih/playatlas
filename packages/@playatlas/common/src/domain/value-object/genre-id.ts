import z from "zod";
import { InvalidStateError } from "../error";

export const genreIdSchema = z.string().min(1, "GenreId cannot be empty");

export type GenreId = string & {
	readonly __brand: "GenreId";
};
export const GenreIdParser = {
	fromExternal(value: string): GenreId {
		if (!value || value.trim() === "") throw new InvalidStateError(`GenreId must not be empty`);
		return value as GenreId;
	},

	fromTrusted(value: string): GenreId {
		return value as GenreId;
	},
};
