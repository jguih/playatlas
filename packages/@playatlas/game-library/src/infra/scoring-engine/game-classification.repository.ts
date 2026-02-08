import { ISODateSchema } from "@playatlas/common/common";
import {
	classificationIdSchema,
	gameClassificationIdSchema,
	gameIdSchema,
	type ClassificationId,
	type GameClassificationId,
} from "@playatlas/common/domain";
import {
	makeBaseRepository,
	type BaseRepositoryDeps,
	type IEntityRepositoryPort,
} from "@playatlas/common/infra";
import z from "zod";
import type { IGameClassificationMapperPort } from "../../application/scoring-engine/game-classification.mapper";
import type { ScoreEngineVersion } from "../../application/scoring-engine/score-engine.port";
import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";
import type { GameClassificationRepositoryFilters } from "./game-classification.repository.types";

export const gameClassificationSchema = z.object({
	Id: gameClassificationIdSchema,
	GameId: gameIdSchema,
	ClassificationId: classificationIdSchema,
	Score: z.number(),
	EngineVersion: z.string(),
	BreakdownJson: z.string(),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type GameClassificationModel = z.infer<typeof gameClassificationSchema>;

export type IGameClassificationRepositoryPort = IEntityRepositoryPort<
	GameClassificationId,
	GameClassification,
	GameClassificationRepositoryFilters
> & {
	getLatestEngineVersions(): Map<ClassificationId, ScoreEngineVersion>;
};

export type GameClassificationRepositoryDeps = BaseRepositoryDeps & {
	gameClassificationMapper: IGameClassificationMapperPort;
};

export const makeGameClassificationRepository = ({
	getDb,
	gameClassificationMapper,
	logService,
}: GameClassificationRepositoryDeps): IGameClassificationRepositoryPort => {
	const TABLE_NAME = "game_classification";
	const COLUMNS: (keyof GameClassificationModel)[] = [
		"Id",
		"GameId",
		"ClassificationId",
		"Score",
		"EngineVersion",
		"BreakdownJson",
		"LastUpdatedAt",
		"CreatedAt",
		"DeletedAt",
		"DeleteAfter",
	];

	const getWhereClauseAndParamsFromFilters = (filters?: GameClassificationRepositoryFilters) => {
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
			mapper: gameClassificationMapper,
			modelSchema: gameClassificationSchema,
			getWhereClauseAndParamsFromFilters,
			getOrderBy: () => `ORDER BY LastUpdatedAt ASC, Id ASC`,
		},
	});

	const add: IGameClassificationRepositoryPort["add"] = (gameClassification) => {
		base._add(gameClassification);
	};

	const upsert: IGameClassificationRepositoryPort["upsert"] = (gameClassification) => {
		base._upsert(gameClassification);
	};

	const update: IGameClassificationRepositoryPort["update"] = (gameClassification) => {
		base._update(gameClassification);
	};

	const getLatestEngineVersions: IGameClassificationRepositoryPort["getLatestEngineVersions"] =
		() => {
			const latest = new Map<ClassificationId, string>();

			for (const gc of base.public.all()) {
				latest.set(gc.getClassificationId(), gc.getEngineVersion());
			}

			return latest;
		};

	return {
		...base.public,
		add,
		upsert,
		update,
		getLatestEngineVersions,
	};
};
