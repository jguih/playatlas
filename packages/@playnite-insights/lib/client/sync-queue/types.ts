import type z from "zod";
import type { syncQueueItemSchema } from "./schemas";

export type SyncQueueItem = z.infer<typeof syncQueueItemSchema>;
