import type { IFileSystemServicePort, ISignatureServicePort } from "@playatlas/common/application";
import type { DatabaseSync } from "node:sqlite";

export type IInfraModulePort = Readonly<{
	getFsService: () => IFileSystemServicePort;
	getSignatureService: () => ISignatureServicePort;
	getDb: () => DatabaseSync;
	setDb: (db: DatabaseSync) => void;
	/**
	 * Initialize the database, creating the SQLite db file and running migrations
	 */
	initDb: () => Promise<void>;
	/**
	 * Creates required environment folders and files
	 */
	initEnvironment: () => Promise<void>;
}>;
