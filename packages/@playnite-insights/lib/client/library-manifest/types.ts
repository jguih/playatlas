import type { libraryManifestSchema } from "./schemas";
import type { z } from "zod";

export type PlayniteLibraryManifest = z.infer<typeof libraryManifestSchema>;
