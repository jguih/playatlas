import { completionStatusIdSchema } from "@playatlas/common/domain";
import { type BaseRepositoryDeps, makeBaseRepository } from "@playatlas/common/infra";
import z from "zod";
import { completionStatusMapper } from "../completion-status.mapper";
import type { ICompletionStatusRepositoryPort } from "./completion-status.repository.port";

export const completionStatusSchema = z.object({
	Id: completionStatusIdSchema,
	Name: z.string(),
});

export type CompletionStatusModel = z.infer<typeof completionStatusSchema>;

export const makeCompletionStatusRepository = ({
	getDb,
	logService,
}: BaseRepositoryDeps): ICompletionStatusRepositoryPort => {
	const TABLE_NAME = `completion_status`;
	const COLUMNS: (keyof CompletionStatusModel)[] = ["Id", "Name"];
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
