import z from "zod";
import { InvalidStateError } from "../error";

export const gameSessionIdSchema = z
  .string()
  .min(1, "Game session id cannot be empty");

export type GameSessionId = string & {
  readonly __brand: "GameSessionId";
};

export const GameSessionIdParser = {
  fromExternal(value: string): GameSessionId {
    const { success, data, error } = gameSessionIdSchema.safeParse(value);
    if (success) return data as GameSessionId;
    throw new InvalidStateError(`Invalid Game Session Id: \n${error.issues}`);
  },

  fromTrusted(value: string): GameSessionId {
    return value as GameSessionId;
  },
};
