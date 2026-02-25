import z from "zod";
import { InvalidStateError } from "../error";

export const extensionRegistrationIdSchema = z.number();

export type ExtensionRegistrationId = number & {
	readonly __brand: "ExtensionRegistrationId";
};

export const ExtensionRegistrationIdParser = {
	fromExternal(value: number): ExtensionRegistrationId {
		if (!value || value < 0)
			throw new InvalidStateError(`ExtensionRegistrationId must be a positive integer`);
		return value as ExtensionRegistrationId;
	},

	fromTrusted(value: number): ExtensionRegistrationId {
		return value as ExtensionRegistrationId;
	},
};
