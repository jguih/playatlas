import type z from "zod";
import type { platformSchema } from "./schemas";

export type Platform = z.infer<typeof platformSchema>;
