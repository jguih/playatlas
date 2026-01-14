import z from "zod";
import { InvalidStateError } from "../error";

export const genreIdSchema = z.string().min(1, "GenreId cannot be empty");

export type GenreId = string & {
	readonly __brand: "GenreId";
};
export const GenreIdParser = {
	fromExternal(value: string): GenreId {
		const { success, data, error } = genreIdSchema.safeParse(value);
		if (success) return data as GenreId;
		throw new InvalidStateError(`Invalid Genre Id: \n${error.issues}`);
	},

	fromTrusted(value: string): GenreId {
		return value as GenreId;
	},
};
