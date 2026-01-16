import { z } from "zod";
import { InvalidStateError } from "../error";

export const gameIdSchema = z.string().min(1, "GameId cannot be empty").uuid();

export type GameId = z.infer<typeof gameIdSchema> & {
	readonly __brand: "GameId";
};

export const GameIdParser = {
	fromExternal(value: string): GameId {
		const { success, data } = gameIdSchema.safeParse(value);
		if (!success) throw new InvalidStateError(`GameId must be a valid UUID`);
		return data as GameId;
	},

	fromTrusted(value: string): GameId {
		return value as GameId;
	},
};
