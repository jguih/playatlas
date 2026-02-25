import type z from "zod";
import type { synchronizationIdSchema } from "./schemas";

export type SynchronizationId = z.infer<typeof synchronizationIdSchema>;
