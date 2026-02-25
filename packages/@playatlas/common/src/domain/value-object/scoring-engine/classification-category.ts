import z from "zod";

export const classificationCategories = ["genre"] as const satisfies string[];

export const classificationCategorySchema = z.enum(classificationCategories);

export type ClassificationCategory = z.infer<typeof classificationCategorySchema>;
