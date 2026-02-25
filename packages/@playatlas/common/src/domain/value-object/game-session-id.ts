import z from "zod";
import { InvalidStateError } from "../error";

export const gameSessionIdSchema = z.string().min(1, "Game session id cannot be empty");

export type GameSessionId = string & {
	readonly __brand: "GameSessionId";
};

export const GameSessionIdParser = {
	fromExternal(value: string): GameSessionId {
		if (!value || value.trim() === "")
			throw new InvalidStateError(`GameSessionId must not be empty`);
		return value as GameSessionId;
	},

	fromTrusted(value: string): GameSessionId {
		return value as GameSessionId;
	},
};
