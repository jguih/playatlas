import z from "zod";
import { InvalidStateError } from "../../error";

export const workerIdSchema = z.guid();

export type WorkerId = string & {
	readonly __brand: "WorkerId";
};
export const WorkerIdParser = {
	fromExternal(value: string): WorkerId {
		const { success, data } = workerIdSchema.safeParse(value);
		if (!success) throw new InvalidStateError(`WorkerId must not be empty`);
		return data as WorkerId;
	},

	fromTrusted(value: string): WorkerId {
		return value as WorkerId;
	},
};
