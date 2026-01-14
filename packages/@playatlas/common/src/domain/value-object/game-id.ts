import { z } from "zod";
import { InvalidStateError } from "../error";

export const gameIdSchema = z.string().min(1, "GameId cannot be empty");

export type GameId = z.infer<typeof gameIdSchema> & {
	readonly __brand: "GameId";
};

export const GameIdParser = {
	fromExternal(value: string): GameId {
		if (!value || value.trim() === "") throw new InvalidStateError(`GameId must not be empty`);
		return value as GameId;
	},

	fromTrusted(value: string): GameId {
		return value as GameId;
	},
};
