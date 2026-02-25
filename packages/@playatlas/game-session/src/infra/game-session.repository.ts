import { ISODateSchema } from "@playatlas/common/common";
import { gameSessionStatus } from "@playatlas/common/domain";
import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import type { IGameSessionMapperPort } from "../application";
import type { GameSessionRepositoryFilters } from "./game-session.repository.filters";
import type { IGameSessionRepositoryPort } from "./game-session.repository.port";

export const gameSessionSchema = z.object({
	SessionId: z.string(),
	GameId: z.string(),
	GameName: z.string().nullable(),
	StartTime: z.string(),
	EndTime: z.string().nullable(),
	Duration: z.number().nullable(),
	Status: z.enum(gameSessionStatus),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type GameSessionModel = z.infer<typeof gameSessionSchema>;

export type GameSessionRepositoryDeps = BaseRepositoryDeps & {
	gameSessionMapper: IGameSessionMapperPort;
};

export const makeGameSessionRepository = ({
	getDb,
	logService,
	gameSessionMapper,
}: GameSessionRepositoryDeps): IGameSessionRepositoryPort => {
	const TABLE_NAME = "game_session" as const;
	const COLUMNS: (keyof GameSessionModel)[] = [
		"SessionId",
		"GameId",
		"StartTime",
		"Duration",
		"EndTime",
		"GameName",
		"Status",
		"LastUpdatedAt",
		"CreatedAt",
		"DeletedAt",
		"DeleteAfter",
	] as const;

	const getWhereClauseAndParamsFromFilters = (filters?: GameSessionRepositoryFilters) => {
		const where: string[] = [];
		const params: (string | number)[] = [];

		if (!filters) {
			return { where: "", params };
		}

		if (filters.syncCursor) {
			const syncCursor = filters.syncCursor;

			where.push(`(LastUpdatedAt > ? OR (LastUpdatedAt = ? AND SessionId > ?))`);
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
			idColumn: "SessionId",
			insertColumns: COLUMNS,
			updateColumns: COLUMNS.filter((c) => c !== "SessionId"),
			mapper: gameSessionMapper,
			modelSchema: gameSessionSchema,
			getWhereClauseAndParamsFromFilters,
			getOrderBy: () => `ORDER BY LastUpdatedAt ASC, SessionId ASC`,
		},
	});

	const add: IGameSessionRepositoryPort["add"] = (session) => {
		base._add(session);
	};

	const upsert: IGameSessionRepositoryPort["upsert"] = (session) => {
		base._upsert(session);
	};

	const update: IGameSessionRepositoryPort["update"] = (session) => {
		base._update(session);
	};

	return { ...base.public, add, upsert, update };
};
