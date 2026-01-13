import type z from "zod";
import type { companySchema } from "./schemas";

export type Company = z.infer<typeof companySchema>;
