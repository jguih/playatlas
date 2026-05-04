import z from "zod";
import { InvalidStateError } from "../../error";

export const jobIdSchema = z.ulid();

export type JobId = string & {
	readonly __brand: "JobId";
};
export const JobIdParser = {
	fromExternal(value: string): JobId {
		const { success, data } = jobIdSchema.safeParse(value);
		if (!success) throw new InvalidStateError(`JobId must not be empty`);
		return data as JobId;
	},

	fromTrusted(value: string): JobId {
		return value as JobId;
	},
};
