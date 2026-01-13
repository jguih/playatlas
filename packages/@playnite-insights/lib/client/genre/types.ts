import type z from "zod";
import type { genreSchema } from "./schemas";

export type Genre = z.infer<typeof genreSchema>;
