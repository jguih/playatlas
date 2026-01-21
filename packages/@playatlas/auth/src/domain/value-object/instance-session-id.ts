import { InvalidStateError } from "@playatlas/common/domain";
import z from "zod";

export const instanceSessionIdSchema = z.string().min(1).uuid();

export type InstanceSessionId = string & {
	readonly __brand: "SessionId";
};

export const InstanceSessionIdParser = {
	fromExternal: (value: string): InstanceSessionId => {
		const { success, data } = instanceSessionIdSchema.safeParse(value);
		if (!success) throw new InvalidStateError("Instance SessionId must be a valid UUID");
		return data as InstanceSessionId;
	},

	fromTrusted: (value: string): InstanceSessionId => {
		return value as InstanceSessionId;
	},
};
