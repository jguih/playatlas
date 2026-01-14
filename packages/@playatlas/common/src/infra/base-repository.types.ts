import type { DatabaseSync } from "node:sqlite";
import type { ZodSchema } from "zod";
import type { EntityMapper } from "../application";
import type { ILogServicePort } from "../application/log-service.port";

export type BaseRepositoryConfig<TEntity, TPersistence> = {
	tableName: string;
	idColumn: keyof TPersistence;
	insertColumns: (keyof TPersistence)[];
	updateColumns: (keyof TPersistence)[];
	modelSchema: ZodSchema<TPersistence>;
	mapper: EntityMapper<TEntity, TPersistence>;
	autoIncrementId?: boolean;
};

export type BaseRepositoryDeps = {
	logService: ILogServicePort;
	getDb: () => DatabaseSync;
};

export type MakeBaseRepositoryDeps<TEntity, TPersistence> = BaseRepositoryDeps & {
	config: BaseRepositoryConfig<TEntity, TPersistence>;
};
