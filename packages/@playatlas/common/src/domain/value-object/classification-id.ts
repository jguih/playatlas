import { z } from "zod";

export const classificationIds = ["HORROR", "SURVIVAL", "RPG"] as const satisfies string[];

export const classificationIdSchema = z.enum(classificationIds);

export type ClassificationId = z.infer<typeof classificationIdSchema>;
