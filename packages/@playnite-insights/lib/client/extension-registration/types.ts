import type z from "zod";
import type { extensionRegistrationSchema } from "./schemas";

export type ExtensionRegistration = z.infer<typeof extensionRegistrationSchema>;
