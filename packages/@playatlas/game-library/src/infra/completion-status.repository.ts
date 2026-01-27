import { ISODateSchema } from "@playatlas/common/common";
import { completionStatusIdSchema } from "@playatlas/common/domain";
import { type BaseRepositoryDeps, makeBaseRepository } from "@playatlas/common/infra";
import z from "zod";
import type { ICompletionStatusMapperPort } from "../application/completion-status.mapper";
import type { ICompletionStatusRepositoryPort } from "./completion-status.repository.port";
import type { CompletionStatusRepositoryFilters } from "./completion-status.repository.types";

export const completionStatusSchema = z.object({
	Id: completionStatusIdSchema,
	Name: z.string(),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type CompletionStatusModel = z.infer<typeof completionStatusSchema>;

export type CompletionStatusRepositoryDeps = BaseRepositoryDeps & {
	completionStatusMapper: ICompletionStatusMapperPort;
};

export const makeCompletionStatusRepository = ({
	getDb,
	logService,
	completionStatusMapper,
}: CompletionStatusRepositoryDeps): ICompletionStatusRepositoryPort => {
	const TABLE_NAME = `playnite_completion_status`;
	const COLUMNS: (keyof CompletionStatusModel)[] = [
		"Id",
		"Name",
		"LastUpdatedAt",
		"CreatedAt",
		"DeletedAt",
		"DeleteAfter",
	];

	const getWhereClauseAndParamsFromFilters = (filters?: CompletionStatusRepositoryFilters) => {
		const where: string[] = [];
		const params: (string | number)[] = [];

		if (!filters) {
			return { where: "", params };
		}

		if (filters.syncCursor) {
			const syncCursor = filters.syncCursor;

			where.push(`(LastUpdatedAt > ? OR (LastUpdatedAt = ? AND Id > ?))`);
			params.push(
				syncCursor.lastUpdatedAt.toISOString(),
				syncCursor.lastUpdatedAt.toISOString(),
				syncCursor.id,
			);
		}

		return {
			where: where.length > 0 ? `WHERE ${where.join(" AND ")}` : "",
			params,
		};
	};

	const base = makeBaseRepository({
		getDb,
		logService,
		config: {
			tableName: TABLE_NAME,
			idColumn: "Id",
			insertColumns: COLUMNS,
			updateColumns: COLUMNS.filter((c) => c !== "Id"),
			mapper: completionStatusMapper,
			modelSchema: completionStatusSchema,
			getWhereClauseAndParamsFromFilters,
			getOrderBy: () => `ORDER BY LastUpdatedAt ASC, Id ASC`,
		},
	});

	const add: ICompletionStatusRepositoryPort["add"] = (completionStatus) => {
		base._add(completionStatus);
	};

	const upsert: ICompletionStatusRepositoryPort["upsert"] = (completionStatus) => {
		base._upsert(completionStatus);
	};

	const update: ICompletionStatusRepositoryPort["update"] = (completionStatus) => {
		base._update(completionStatus);
	};

	return {
		...base.public,
		add,
		upsert,
		update,
	};
};
