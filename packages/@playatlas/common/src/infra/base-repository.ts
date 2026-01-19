import type { SQLInputValue } from "node:sqlite";
import z from "zod";
import { InvalidDataError } from "../domain";
import type { BaseEntity, BaseEntityId } from "../domain/base-entity";
import type { BaseRepositoryPort } from "./base-repository.port";
import type { MakeBaseRepositoryDeps } from "./base-repository.types";
import * as dbOps from "./db-operations";

const PERFORMANCE_WARN_THRESHOLD_MS = 50;

export const makeBaseRepository = <
	TEntityId extends BaseEntityId,
	TEntity extends BaseEntity<TEntityId>,
	TPersistence,
>({
	getDb,
	logService,
	config,
}: MakeBaseRepositoryDeps<TEntity, TPersistence>): BaseRepositoryPort<
	TEntityId,
	TEntity,
	TPersistence
> => {
	const {
		tableName,
		idColumn,
		insertColumns,
		updateColumns,
		mapper,
		modelSchema,
		autoIncrementId = false,
	} = config;

	const insertSql = `
    INSERT INTO ${tableName}
      (${insertColumns.join(", ")})
    VALUES
      (${insertColumns.map(() => "?").join(", ")});
  `;
	const upsertSql = `
    INSERT INTO ${tableName}
      (${insertColumns.join(", ")})
    VALUES
      (${insertColumns.map(() => "?").join(", ")})
    ON CONFLICT DO UPDATE SET
      ${updateColumns.map((c) => `${String(c)} = excluded.${String(c)}`).join(", ")};
  `;
	const updateSql = `
    UPDATE ${tableName}
    SET ${updateColumns.map((s) => `${String(s)} = ?`).join(", ")}
    WHERE ${String(idColumn)} = ?;
  `;
	const getAllSql = `
    SELECT * 
    FROM ${tableName} 
    ORDER BY ${String(idColumn)} DESC;
  `;
	const removeSql = `
    DELETE FROM ${tableName} WHERE ${String(idColumn)} = ?;
  `;
	const getByIdSql = `
    SELECT * FROM ${tableName} WHERE ${String(idColumn)} = ?;
  `;
	const existsSql = `
    SELECT EXISTS (
      SELECT 1 FROM ${tableName} 
      WHERE ${String(idColumn)} = (?)
    );
  `;

	const run: BaseRepositoryPort<TEntityId, TEntity, TPersistence>["run"] = (
		fn,
		context,
		shouldLog,
	) => {
		const db = getDb();
		const start = performance.now();

		try {
			const result = fn({ db });

			const duration = performance.now() - start;
			const message = `Repository call ${context ? context : ""} took ${duration.toFixed(1)}ms`;

			if (shouldLog) {
				if (duration >= PERFORMANCE_WARN_THRESHOLD_MS) logService.warning(message);
				else logService.debug(message);
			}

			return result;
		} catch (error) {
			const duration = performance.now() - start;

			if (error instanceof InvalidDataError) {
				logService.debug(
					`Repository call ${context ?? ""} threw InvalidDataError after ${duration.toFixed(1)}ms`,
				);
			} else {
				logService.error(
					`Repository call ${context ?? ""} failed after ${duration.toFixed(1)}ms`,
					error,
				);
			}

			throw error;
		}
	};

	const runSavePoint: BaseRepositoryPort<TEntityId, TEntity, TPersistence>["runSavePoint"] = (
		fn,
	) => {
		return dbOps.runSavePoint({ getDb, fn });
	};

	const buildInvalidDataError: BaseRepositoryPort<
		TEntityId,
		TEntity,
		TPersistence
	>["buildInvalidDataError"] = (error, context) => {
		const first = error.issues.at(0);

		return new InvalidDataError({
			entity: context.entity,
			operation: context.operation,
			issueCount: error.issues.length,
			firstIssue: first
				? {
						path: first.path.join("."),
						message: first.message,
						code: first.code,
					}
				: undefined,
		});
	};

	const _add: BaseRepositoryPort<TEntityId, TEntity, TPersistence>["_add"] = (
		entity,
		options = {},
	) => {
		const entities = Array.isArray(entity) ? entity : [entity];

		return run(() => {
			return runSavePoint(({ db }) => {
				const stmt = db.prepare(insertSql);
				const results: Array<[TEntity, TPersistence, { lastInsertRowid: number | bigint }]> = [];

				for (const entity of entities) {
					entity.validate();
					const model = (options.toPersistence ?? mapper.toPersistence)(entity);
					const params = insertColumns.map((col) => model[col]);
					const { lastInsertRowid } = stmt.run(...(params as SQLInputValue[]));
					results.push([entity, model, { lastInsertRowid }]);
					logService.debug(`Added record with id ${lastInsertRowid}`);
				}
				return results;
			});
		}, `add(${entities.length} entity(s))`);
	};

	const _update: BaseRepositoryPort<TEntityId, TEntity, TPersistence>["_update"] = (
		entity,
		options = {},
	) => {
		return run(({ db }) => {
			entity.validate();
			const stmt = db.prepare(updateSql);
			const model = (options.toPersistence ?? mapper.toPersistence)(entity);
			const params = updateColumns.map((col) => model[col]);
			stmt.run(...(params as SQLInputValue[]), entity.getId());
			logService.debug(`Updated record with id ${entity.getSafeId()}`);
			return model;
		}, `update(${entity.getSafeId()})`);
	};

	const all: BaseRepositoryPort<TEntityId, TEntity, TPersistence>["public"]["all"] = () => {
		return run(({ db }) => {
			const stmt = db.prepare(getAllSql);
			const result = stmt.all();

			const { success, data: models, error } = z.array(modelSchema).safeParse(result);

			if (!success) {
				throw buildInvalidDataError(error, { entity: tableName, operation: "load" });
			}

			const entities: TEntity[] = [];
			for (const model of models) entities.push(mapper.toDomain(model));
			logService.debug(`Found ${entities.length} records`);
			return entities;
		}, `all()`);
	};

	const remove: BaseRepositoryPort<TEntityId, TEntity, TPersistence>["public"]["remove"] = (id) => {
		const ids = Array.isArray(id) ? id : [id];
		return run(
			({ db }) => {
				const stmt = db.prepare(removeSql);
				for (const id of ids) {
					stmt.run(id);
					logService.debug(`Deleted record with id ${id}`);
				}
			},
			`remove(${String(id)})`,
		);
	};

	const getById: BaseRepositoryPort<TEntityId, TEntity, TPersistence>["public"]["getById"] = (
		id,
	) => {
		return run(({ db }) => {
			const stmt = db.prepare(getByIdSql);
			const result = stmt.get(id);
			if (!result) return null;

			const { success, data: model, error } = modelSchema.safeParse(result);

			if (!success) {
				throw buildInvalidDataError(error, { entity: tableName, operation: "load" });
			}

			const entity = mapper.toDomain(model);
			logService.debug(`Found record with id ${entity.getSafeId()}`);
			return entity;
		}, `getById(${id})`);
	};

	const _upsert: BaseRepositoryPort<TEntityId, TEntity, TPersistence>["_upsert"] = (
		entity,
		options = {},
	) => {
		const entities = Array.isArray(entity) ? entity : [entity];

		return run(() => {
			return runSavePoint(({ db }) => {
				const stmt = db.prepare(upsertSql);
				const results: Array<[TEntity, TPersistence, { lastInsertRowid: number | bigint }]> = [];

				for (const entity of entities) {
					entity.validate();
					const model = (options.toPersistence ?? mapper.toPersistence)(entity);
					const params = insertColumns.map((col) => model[col]);
					const { lastInsertRowid } = stmt.run(...(params as SQLInputValue[]));
					results.push([entity, model, { lastInsertRowid }]);
					const id = autoIncrementId ? lastInsertRowid : entity.getSafeId();
					logService.debug(`Updated or added record with id ${id}`);
				}

				return results;
			});
		}, `upsert()`);
	};

	const exists: BaseRepositoryPort<TEntityId, TEntity, TPersistence>["public"]["exists"] = (id) => {
		return run(({ db }) => {
			const stmt = db.prepare(existsSql);
			const result = stmt.get(id);
			if (result) {
				return Object.values(result)[0] === 1;
			}
			return false;
		});
	};

	return {
		run,
		runSavePoint,
		buildInvalidDataError,
		public: {
			all,
			remove,
			getById,
			exists,
		},
		_add,
		_upsert,
		_update,
	};
};
