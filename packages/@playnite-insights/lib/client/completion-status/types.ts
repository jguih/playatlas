import type z from "zod";
import type { completionStatusSchema } from "./schemas";

export type CompletionStatus = z.infer<typeof completionStatusSchema>;
