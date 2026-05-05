import { ISODateSchema } from "@playatlas/common/common";
import { jobIdSchema, jobStatuses, jobTypes, workerIdSchema } from "@playatlas/common/domain";
import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import type { IJobMapperPort } from "../application/job.mapper";
import type { IJobRepositoryPort } from "./job.repository.port";

export const jobSchema = z.object({
	Id: jobIdSchema,
	Type: z.enum(jobTypes),
	Payload: z.string(),
	Status: z.enum(jobStatuses),
	Attempts: z.number(),
	MaxAttempts: z.number(),
	Priority: z.number(),
	RunAt: ISODateSchema,
	LockedAt: ISODateSchema.nullable(),
	WorkerId: workerIdSchema.nullable(),
	LastError: z.string().nullable(),
	CreatedAt: ISODateSchema,
	LastUpdatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type JobModel = z.infer<typeof jobSchema>;

export type JobRepositoryDeps = BaseRepositoryDeps & {
	jobMapper: IJobMapperPort;
};

export const makeJobRepository = ({
	getDb,
	logService,
	jobMapper,
}: JobRepositoryDeps): IJobRepositoryPort => {
	const TABLE_NAME = "job" as const;
	const COLUMNS: (keyof JobModel)[] = [
		"Id",
		"Payload",
		"Status",
		"Attempts",
		"MaxAttempts",
		"Priority",
		"RunAt",
		"LockedAt",
		"WorkerId",
		"LastError",
		"CreatedAt",
		"LastUpdatedAt",
		"DeletedAt",
		"DeleteAfter",
	] as const;

	const base = makeBaseRepository({
		getDb,
		logService,
		config: {
			tableName: TABLE_NAME,
			idColumn: "Id",
			insertColumns: COLUMNS,
			updateColumns: COLUMNS.filter((c) => c !== "Id"),
			mapper: jobMapper,
			modelSchema: jobSchema,
			getOrderBy: () => `ORDER BY LastUpdatedAt ASC, Id ASC`,
		},
	});

	const add: IJobRepositoryPort["add"] = (job) => {
		base._add(job);
	};

	const upsert: IJobRepositoryPort["upsert"] = (job) => {
		base._upsert(job);
	};

	const update: IJobRepositoryPort["update"] = (job) => {
		base._update(job);
	};

	return { ...base.public, add, upsert, update };
};
