import { InvalidStateError } from "@playatlas/common/domain";
import { z } from "zod";

export const classificationIds = ["HORROR", "SURVIVAL", "RPG"] as const satisfies string[];

export const classificationIdSchema = z.enum(classificationIds);

export type ClassificationId = z.infer<typeof classificationIdSchema> & {
	readonly __brand: "ClassificationId";
};

export const ClassificationIdParser = {
	fromExternal(value: (typeof classificationIds)[number]): ClassificationId {
		const { data, success } = classificationIdSchema.safeParse(value);
		if (!success)
			throw new InvalidStateError(
				`ClassificationId must be one of: ${classificationIds.join(", ")}`,
			);
		return data as ClassificationId;
	},

	fromTrusted(value: (typeof classificationIds)[number]): ClassificationId {
		return value as ClassificationId;
	},
};
