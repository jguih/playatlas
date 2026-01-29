import { ISODateSchema } from "@playatlas/common/common";
import { platformIdSchema, playnitePlatformIdSchema } from "@playatlas/common/domain";
import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import type { IPlatformMapperPort } from "../application/platform.mapper";
import type { IPlatformRepositoryPort } from "./platform.repository.port";
import type { PlatformRepositoryFilters } from "./platform.repository.types";

export const platformSchema = z.object({
	Id: platformIdSchema,
	PlayniteId: playnitePlatformIdSchema.nullable(),
	PlayniteSpecificationId: z.string().nullable(),
	Name: z.string(),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type PlatformModel = z.infer<typeof platformSchema>;

export type PlatformRepositoryDeps = BaseRepositoryDeps & {
	platformMapper: IPlatformMapperPort;
};

export const makePlatformRepository = ({
	getDb,
	logService,
	platformMapper,
}: PlatformRepositoryDeps): IPlatformRepositoryPort => {
	const TABLE_NAME = "platform";
	const COLUMNS: (keyof PlatformModel)[] = [
		"Id",
		"PlayniteId",
		"PlayniteSpecificationId",
		"Name",
		"LastUpdatedAt",
		"CreatedAt",
		"DeletedAt",
		"DeleteAfter",
	];

	const getWhereClauseAndParamsFromFilters = (filters?: PlatformRepositoryFilters) => {
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
			mapper: platformMapper,
			modelSchema: platformSchema,
			getWhereClauseAndParamsFromFilters,
			getOrderBy: () => `ORDER BY LastUpdatedAt ASC, Id ASC`,
		},
	});

	const add: IPlatformRepositoryPort["add"] = (platform) => {
		base._add(platform);
	};

	const upsert: IPlatformRepositoryPort["upsert"] = (platform) => {
		base._upsert(platform);
	};

	const update: IPlatformRepositoryPort["update"] = (platform) => {
		base._update(platform);
	};

	return {
		...base.public,
		add,
		upsert,
		update,
	};
};
