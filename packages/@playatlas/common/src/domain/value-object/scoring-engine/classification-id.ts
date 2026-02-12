import { z } from "zod";

export const CLASSIFICATION_IDS = ["HORROR", "SURVIVAL", "RUN-BASED"] as const satisfies string[];

export const classificationIdSchema = z.enum(CLASSIFICATION_IDS);

export type ClassificationId = z.infer<typeof classificationIdSchema>;
