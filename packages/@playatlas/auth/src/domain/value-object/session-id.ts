import { InvalidStateError } from "@playatlas/common/domain";
import z from "zod";

export const sessionIdSchema = z.string().min(1).uuid();

export type SessionId = string & {
	readonly __brand: "SessionId";
};

export const SessionIdParser = {
	fromExternal: (value: string): SessionId => {
		const { success, data } = sessionIdSchema.safeParse(value);
		if (!success) throw new InvalidStateError("SessionId must be a valid UUID");
		return data as SessionId;
	},

	fromTrusted: (value: string): SessionId => {
		return value as SessionId;
	},
};
