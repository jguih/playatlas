import { type LibraryManifest } from "./library-manifest";

export type ILibraryManifestServicePort = {
  write: () => Promise<void>;
  get: () => Promise<LibraryManifest | null>;
};
