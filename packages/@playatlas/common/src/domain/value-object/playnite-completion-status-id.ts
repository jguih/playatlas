import { z } from "zod";
import { InvalidStateError } from "../error";

export const playniteCompletionStatusIdSchema = z
	.string()
	.min(1, "Playnite CompletionStatusId cannot be empty");

export type PlayniteCompletionStatusId = z.infer<typeof playniteCompletionStatusIdSchema> & {
	readonly __brand: "PlayniteCompletionStatusId";
};

export const PlayniteCompletionStatusIdParser = {
	fromExternal(value: string): PlayniteCompletionStatusId {
		if (!value || value.trim() === "")
			throw new InvalidStateError(`Playnite CompletionStatusId must not be empty`);
		return value as PlayniteCompletionStatusId;
	},

	fromTrusted(value: string): PlayniteCompletionStatusId {
		return value as PlayniteCompletionStatusId;
	},
};
