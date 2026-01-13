import { z } from "zod";
import { InvalidStateError } from "../error";

export const gameIdSchema = z.string().min(1, "GameId cannot be empty");

export type GameId = z.infer<typeof gameIdSchema> & {
  readonly __brand: "GameId";
};

export const GameIdParser = {
  fromExternal(value: string): GameId {
    const { success, data, error } = gameIdSchema.safeParse(value);
    if (success) return data as GameId;
    throw new InvalidStateError(`Invalid Game Id: \n${error.issues}`);
  },

  fromTrusted(value: string): GameId {
    return value as GameId;
  },
};
