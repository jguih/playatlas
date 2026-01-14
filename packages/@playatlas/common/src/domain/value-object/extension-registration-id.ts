import z from "zod";
import { InvalidStateError } from "../error";

export const extensionRegistrationIdSchema = z.number();

export type ExtensionRegistrationId = number & {
	readonly __brand: "ExtensionRegistrationId";
};

export const ExtensionRegistrationIdParser = {
	fromExternal(value: number): ExtensionRegistrationId {
		const { success, data, error } = extensionRegistrationIdSchema.safeParse(value);
		if (success) return data as ExtensionRegistrationId;
		throw new InvalidStateError(`Invalid Extension Registration Id: \n${error.issues}`);
	},

	fromTrusted(value: number): ExtensionRegistrationId {
		return value as ExtensionRegistrationId;
	},
};
