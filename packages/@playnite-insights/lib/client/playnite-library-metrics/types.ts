import type z from "zod";
import type { playniteLibraryMetricsSchema } from "./schemas";

export type PlayniteLibraryMetrics = z.infer<
  typeof playniteLibraryMetricsSchema
>;
