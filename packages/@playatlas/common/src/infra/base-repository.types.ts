import type { DatabaseSync } from "node:sqlite";
import type { ZodSchema } from "zod";
import type { EntityMapper } from "../application";
import type { ILogServicePort } from "../application/log-service.port";

export type BaseRepositoryConfig<TEntity, TPersistence, TFilters = undefined> = {
	tableName: string;
	idColumn: keyof TPersistence;
	insertColumns: (keyof TPersistence)[];
	updateColumns: (keyof TPersistence)[];
	modelSchema: ZodSchema<TPersistence>;
	mapper: EntityMapper<TEntity, TPersistence>;
	autoIncrementId?: boolean;
	getWhereClauseAndParamsFromFilters?: (filters?: TFilters) => {
		where: string;
		params: Array<string | number>;
	};
	getOrderBy?: () => string;
};

export type DbGetter = () => DatabaseSync;

export type BaseRepositoryDeps = {
	logService: ILogServicePort;
	getDb: DbGetter;
};

export type MakeBaseRepositoryDeps<
	TEntity,
	TPersistence,
	TFilters = undefined,
> = BaseRepositoryDeps & {
	config: BaseRepositoryConfig<TEntity, TPersistence, TFilters>;
};
