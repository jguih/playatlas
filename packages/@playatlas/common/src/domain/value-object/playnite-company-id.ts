import { z } from "zod";
import { InvalidStateError } from "../error";

export const playniteCompanyIdSchema = z.string().min(1, "Playnite CompanyId cannot be empty");

export type PlayniteCompanyId = z.infer<typeof playniteCompanyIdSchema> & {
	readonly __brand: "PlayniteCompanyId";
};

export const PlayniteCompanyIdParser = {
	fromExternal(value: string): PlayniteCompanyId {
		if (!value || value.trim() === "")
			throw new InvalidStateError(`Playnite CompanyId must not be empty`);
		return value as PlayniteCompanyId;
	},

	fromTrusted(value: string): PlayniteCompanyId {
		return value as PlayniteCompanyId;
	},
};
