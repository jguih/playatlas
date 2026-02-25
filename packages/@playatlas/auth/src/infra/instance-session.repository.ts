import { ISODateSchema } from "@playatlas/common/common";
import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import { type IInstanceSessionMapperPort } from "../application/instance-session.mapper";
import type { IInstanceSessionRepositoryPort } from "./instance-session.repository.port";

export const instanceSessionSchema = z.object({
	Id: z.string(),
	CreatedAt: ISODateSchema,
	LastUsedAt: ISODateSchema,
	LastUpdatedAt: ISODateSchema,
});

export type InstanceSessionModel = z.infer<typeof instanceSessionSchema>;

export type InstanceSessionRepositoryDeps = BaseRepositoryDeps & {
	instanceSessionMapper: IInstanceSessionMapperPort;
};

export const makeInstanceSessionRepository = ({
	getDb,
	logService,
	instanceSessionMapper,
}: InstanceSessionRepositoryDeps): IInstanceSessionRepositoryPort => {
	const TABLE_NAME = "instance_sessions";
	const COLUMNS = Object.keys(instanceSessionSchema.shape) as (keyof InstanceSessionModel)[];
	const base = makeBaseRepository({
		getDb,
		logService,
		config: {
			modelSchema: instanceSessionSchema,
			mapper: instanceSessionMapper,
			tableName: TABLE_NAME,
			idColumn: "Id",
			insertColumns: COLUMNS,
			updateColumns: ["LastUsedAt", "LastUpdatedAt"],
		},
	});

	const add: IInstanceSessionRepositoryPort["add"] = (entity) => {
		base._add(entity);
	};

	const upsert: IInstanceSessionRepositoryPort["upsert"] = (entity) => {
		base._upsert(entity);
	};

	const update: IInstanceSessionRepositoryPort["update"] = (entity) => {
		base._update(entity);
	};

	return {
		...base.public,
		add,
		upsert,
		update,
	};
};
