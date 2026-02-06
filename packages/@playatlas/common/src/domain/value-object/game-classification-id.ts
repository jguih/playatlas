import z from "zod";
import { InvalidStateError } from "../error";

export const gameClassificationIdSchema = z.ulid();

export type GameClassificationId = string & {
	readonly __brand: "GameClassificationId";
};
export const GameClassificationIdParser = {
	fromExternal(value: string): GameClassificationId {
		const { success, data } = gameClassificationIdSchema.safeParse(value);
		if (!success) throw new InvalidStateError(`GameClassificationId must be a valid ULID`);
		return data as GameClassificationId;
	},

	fromTrusted(value: string): GameClassificationId {
		return value as GameClassificationId;
	},
};
