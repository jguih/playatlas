import { InvalidStateError } from "@playatlas/common/domain";
import z from "zod";

export const instanceSessionIdSchema = z.string().min(1);

export type InstanceSessionId = string & {
	readonly __brand: "SessionId";
};

export const InstanceSessionIdParser = {
	fromExternal: (value: string): InstanceSessionId => {
		if (!value || value.trim() === "")
			throw new InvalidStateError("Instance SessionId must be a valid UUID");
		return value as InstanceSessionId;
	},

	fromTrusted: (value: string): InstanceSessionId => {
		return value as InstanceSessionId;
	},
};
