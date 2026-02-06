import { ISODateSchema } from "@playatlas/common/common";
import {
	makeBaseRepository,
	type BaseRepositoryDeps,
	type IEntityRepositoryPort,
} from "@playatlas/common/infra";
import z from "zod";
import type { IClassificationMapperPort } from "../../application/scoring-engine/classification.mapper";
import type { Classification } from "../../domain/scoring-engine/classification.entity";
import { classificationCategorySchema } from "../../domain/value-object/classification-category";
import {
	classificationIdSchema,
	type ClassificationId,
} from "../../domain/value-object/classification-id";

export const classificationSchema = z.object({
	Id: classificationIdSchema,
	DisplayName: z.string().min(1),
	Category: classificationCategorySchema,
	Description: z.string().min(1),
	Version: z.string().min(1),
	CreatedAt: ISODateSchema,
	LastUpdatedAt: ISODateSchema,
});

export type ClassificationModel = z.infer<typeof classificationSchema>;

export type IClassificationRepositoryPort = IEntityRepositoryPort<ClassificationId, Classification>;

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
	];

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
