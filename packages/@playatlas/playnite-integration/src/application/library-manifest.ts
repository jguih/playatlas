import type { z } from "zod";
import type { libraryManifestSchema } from "./library-manifest.schema";

export type LibraryManifest = z.infer<typeof libraryManifestSchema>;
