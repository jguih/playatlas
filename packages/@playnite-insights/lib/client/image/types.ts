import type z from "zod";
import type { imageSchema } from "./schemas";

export type Image = z.infer<typeof imageSchema>;
