import { z } from "zod";

export const CLASSIFICATION_IDS = ["HORROR", "SURVIVAL", "RPG"] as const satisfies string[];

export const classificationIdSchema = z.enum(CLASSIFICATION_IDS);

export type ClassificationId = z.infer<typeof classificationIdSchema>;
