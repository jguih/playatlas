import { ISODateSchema } from "@playatlas/common/common";
import {
	classificationCategorySchema,
	classificationIdSchema,
	type ClassificationId,
} from "@playatlas/common/domain";
import {
	makeBaseRepository,
	type BaseRepositoryDeps,
	type IEntityRepositoryPort,
} from "@playatlas/common/infra";
import z from "zod";
import type { IClassificationMapperPort } from "../../application/scoring-engine/classification.mapper";
import type { Classification } from "../../domain/scoring-engine/classification.entity";
import type { ClassificationRepositoryFilters } from "./classification.repository.types";

export const classificationSchema = z.object({
	Id: classificationIdSchema,
	DisplayName: z.string().min(1),
	Category: classificationCategorySchema,
	Description: z.string().min(1),
	Version: z.string().min(1),
	CreatedAt: ISODateSchema,
	LastUpdatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type ClassificationModel = z.infer<typeof classificationSchema>;

export type IClassificationRepositoryPort = IEntityRepositoryPort<
	ClassificationId,
	Classification,
	ClassificationRepositoryFilters
>;

export type ClassificationRepositoryDeps = BaseRepositoryDeps & {
	classificationMapper: IClassificationMapperPort;
};

export const makeClassificationRepository = ({
	getDb,
	classificationMapper,
	logService,
}: ClassificationRepositoryDeps): IClassificationRepositoryPort => {
	const TABLE_NAME = "classification";
	const COLUMNS: (keyof ClassificationModel)[] = [
		"Id",
		"DisplayName",
		"Category",
		"Description",
		"Version",
		"CreatedAt",
		"LastUpdatedAt",
		"DeletedAt",
		"DeleteAfter",
	];

	const getWhereClauseAndParamsFromFilters = (filters?: ClassificationRepositoryFilters) => {
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
			mapper: classificationMapper,
			modelSchema: classificationSchema,
			getWhereClauseAndParamsFromFilters,
			getOrderBy: () => `ORDER BY LastUpdatedAt ASC, Id ASC`,
		},
	});

	const add: IClassificationRepositoryPort["add"] = (classification) => {
		base._add(classification);
	};

	const upsert: IClassificationRepositoryPort["upsert"] = (classification) => {
		base._upsert(classification);
	};

	const update: IClassificationRepositoryPort["update"] = (classification) => {
		base._update(classification);
	};

	return {
		...base.public,
		add,
		upsert,
		update,
	};
};
