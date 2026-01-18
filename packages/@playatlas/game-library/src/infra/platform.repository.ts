import { ISODateSchema } from "@playatlas/common/common";
import { platformIdSchema } from "@playatlas/common/domain";
import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import type { IPlatformMapperPort } from "../application/platform.mapper";
import type { IPlatformRepositoryPort } from "./platform.repository.port";

export const platformSchema = z.object({
	Id: platformIdSchema,
	Name: z.string(),
	SpecificationId: z.string(),
	Icon: z.string().nullable(),
	Cover: z.string().nullable(),
	Background: z.string().nullable(),
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
	const TABLE_NAME = "playnite_platform";
	const COLUMNS: (keyof PlatformModel)[] = [
		"Id",
		"Name",
		"SpecificationId",
		"Icon",
		"Cover",
		"Background",
		"LastUpdatedAt",
		"CreatedAt",
		"DeletedAt",
		"DeleteAfter",
	];
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
