import { ISODateSchema } from "@playatlas/common/common";
import { playniteTagIdSchema, tagIdSchema } from "@playatlas/common/domain";
import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import type { ITagMapperPort } from "../application";
import type { ITagRepositoryPort } from "./tag.repository.port";
import type { TagRepositoryFilters } from "./tag.repository.types";

export const tagSchema = z.object({
	Id: tagIdSchema,
	PlayniteId: playniteTagIdSchema.nullable(),
	Name: z.string(),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type TagModel = z.infer<typeof tagSchema>;

export type TagRepositoryDeps = BaseRepositoryDeps & {
	tagMapper: ITagMapperPort;
};

export const makeTagRepository = ({
	getDb,
	logService,
	tagMapper,
}: TagRepositoryDeps): ITagRepositoryPort => {
	const TABLE_NAME = "tag";
	const COLUMNS: (keyof TagModel)[] = [
		"Id",
		"PlayniteId",
		"Name",
		"LastUpdatedAt",
		"CreatedAt",
		"DeletedAt",
		"DeleteAfter",
	];

	const getWhereClauseAndParamsFromFilters = (filters?: TagRepositoryFilters) => {
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
			mapper: tagMapper,
			modelSchema: tagSchema,
			getWhereClauseAndParamsFromFilters,
			getOrderBy: () => `ORDER BY LastUpdatedAt ASC, Id ASC`,
		},
	});

	const add: ITagRepositoryPort["add"] = (genre) => {
		base._add(genre);
	};

	const upsert: ITagRepositoryPort["upsert"] = (genre) => {
		base._upsert(genre);
	};

	const update: ITagRepositoryPort["update"] = (genre) => {
		base._update(genre);
	};

	return {
		...base.public,
		add,
		update,
		upsert,
	};
};
