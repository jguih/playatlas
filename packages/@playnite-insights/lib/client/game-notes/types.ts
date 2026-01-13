import type z from "zod";
import type { DateFilter } from "../types/date-filter";
import type { gameNoteSchema } from "./schemas";

export type GameNote = z.infer<typeof gameNoteSchema>;

export type GameNoteFilters = {
  lastUpdatedAt?: DateFilter[];
};
