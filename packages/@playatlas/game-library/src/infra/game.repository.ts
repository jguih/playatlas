import { ISODateSchema } from "@playatlas/common/common";
import {
	GameIdParser,
	gameIdSchema,
	playniteGameIdSchema,
	type CompanyId,
	type GameId,
	type GenreId,
	type PlatformId,
} from "@playatlas/common/domain";
import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import type { GameRelationship, GameRelationshipMap } from "../domain/game.entity";
import type { GameFilters } from "../domain/game.types";
import { gameMapper } from "../game.mapper";
import { COLUMNS, GAME_RELATIONSHIP_META, TABLE_NAME } from "./game.repository.constants";
import type { GameRepositoryEagerLoadProps, IGameRepositoryPort } from "./game.repository.port";
import type { GetRelationshipsForFn, UpdateRelationshipsForFn } from "./game.repository.types";

export const GROUPADD_SEPARATOR = ",";

export const gameSchema = z.object({
	Id: gameIdSchema,
	PlayniteId: playniteGameIdSchema,
	PlayniteName: z.string().nullable(),
	PlayniteDescription: z.string().nullable(),
	PlayniteReleaseDate: ISODateSchema.nullable(),
	PlaynitePlaytime: z.number(),
	PlayniteLastActivity: z.string().nullable(),
	PlayniteAdded: ISODateSchema.nullable(),
	PlayniteInstallDirectory: z.string().nullable(),
	PlayniteIsInstalled: z.number(),
	PlayniteBackgroundImage: z.string().nullable(),
	PlayniteCoverImage: z.string().nullable(),
	PlayniteIcon: z.string().nullable(),
	PlayniteHidden: z.number(),
	PlayniteCompletionStatusId: z.string().nullable(),
	ContentHash: z.string(),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
	BackgroundImagePath: z.string().nullable(),
	CoverImagePath: z.string().nullable(),
	IconImagePath: z.string().nullable(),
});

export type GameModel = z.infer<typeof gameSchema>;

export const gameManifestDataSchema = z.array(
	z.object({
		Id: playniteGameIdSchema,
		ContentHash: z.string(),
	}),
);

export type GameManifestData = z.infer<typeof gameManifestDataSchema>;

type GameRepositoryDeps = BaseRepositoryDeps;

export const makeGameRepository = (deps: GameRepositoryDeps): IGameRepositoryPort => {
	const { getDb, logService } = deps;
	const base = makeBaseRepository({
		getDb,
		logService,
		config: {
			tableName: TABLE_NAME,
			idColumn: "Id",
			insertColumns: COLUMNS,
			updateColumns: COLUMNS.filter((c) => c !== "Id"),
			mapper: gameMapper,
			modelSchema: gameSchema,
		},
	});

	const _getWhereClauseAndParamsFromFilters = (filters?: GameFilters) => {
		const where: string[] = [];
		const params: (string | number)[] = [];

		if (!filters) {
			return { where: "", params };
		}

		if (filters.query !== undefined) {
			where.push(`LOWER(Name) LIKE ?`);
			params.push(`%${filters.query.toLowerCase()}%`);
		}

		if (filters.installed !== undefined) {
			where.push(`IsInstalled = ?`);
			params.push(+filters.installed);
		}

		if (filters.hidden != undefined) {
			where.push(`Hidden = ?`);
			params.push(+filters.hidden);
		}

		return {
			where: where.length > 0 ? `WHERE ${where.join(" AND ")}` : "",
			params,
		};
	};

	const _updateRelationshipFor: UpdateRelationshipsForFn = ({
		gameId,
		relationship,
		newRelationshipIds,
	}) => {
		const { table, column } = GAME_RELATIONSHIP_META[relationship];
		return base.run(
			({ db }) => {
				base.runTransaction(() => {
					db.prepare(`DELETE FROM ${table} WHERE GameId = ?`).run(gameId);
					if (newRelationshipIds.length > 0) {
						const stmt = db.prepare(`INSERT INTO ${table} (GameId, ${column}) VALUES (?, ?)`);
						for (const id of newRelationshipIds) {
							stmt.run(gameId, id);
						}
					}
				});
			},
			`_updateRelationshipFor(${gameId}, ${relationship}, ${newRelationshipIds.length} relationship(s))`,
			false,
		);
	};

	const _getRelationshipsFor: GetRelationshipsForFn = ({ relationship, gameIds }) => {
		const { table, column } = GAME_RELATIONSHIP_META[relationship];
		const placeholders = gameIds.map(() => "?").join(",");
		return base.run(
			({ db }) => {
				const stmt = db.prepare(`
            SELECT GameId, ${column}
            FROM ${table}
            WHERE GameId IN (${placeholders})
          `);
				const rows = stmt.all(...gameIds);
				const map = new Map<GameId, GameRelationshipMap[typeof relationship][]>();
				for (const props of rows) {
					const gameId = props.GameId as GameId;
					const entityId = props[column] as GameRelationshipMap[typeof relationship];
					if (!map.get(gameId)) map.set(gameId, []);
					map.get(gameId)!.push(entityId);
				}
				return map;
			},
			`_getRelationshipsFor(${relationship}, ${gameIds.length} game(s))`,
			false,
		);
	};

	const _shouldLoadRelationship = (
		load: GameRepositoryEagerLoadProps["load"],
		relationship: GameRelationship,
	): boolean => {
		if (typeof load === "boolean") return load;
		else if (load?.[relationship] === true) return true;
		else return false;
	};

	const _getAllRelationshipEntities = (
		gameIds: GameId[],
		load: GameRepositoryEagerLoadProps["load"],
	) => {
		let developerIds: Map<GameId, CompanyId[]> | null = null;
		if (_shouldLoadRelationship(load, "developers"))
			developerIds =
				_getRelationshipsFor({
					relationship: "developers",
					gameIds,
				}) ?? [];

		let publisherIds: Map<GameId, CompanyId[]> | null = null;
		if (_shouldLoadRelationship(load, "publishers"))
			publisherIds =
				_getRelationshipsFor({
					relationship: "publishers",
					gameIds,
				}) ?? [];

		let genreIds: Map<GameId, GenreId[]> | null = null;
		if (_shouldLoadRelationship(load, "genres"))
			genreIds =
				_getRelationshipsFor({
					relationship: "genres",
					gameIds,
				}) ?? [];

		let platformIds: Map<GameId, PlatformId[]> | null = null;
		if (_shouldLoadRelationship(load, "platforms"))
			platformIds =
				_getRelationshipsFor({
					relationship: "platforms",
					gameIds,
				}) ?? [];

		return { developerIds, publisherIds, genreIds, platformIds };
	};

	const getTotal: IGameRepositoryPort["getTotal"] = (filters) => {
		return base.run(({ db }) => {
			let query = `
          SELECT 
            COUNT(*) AS Total
          FROM ${TABLE_NAME} pg
        `;
			const { where, params } = _getWhereClauseAndParamsFromFilters(filters);
			query += where;
			const total = (db.prepare(query).get(...params)?.Total as number) ?? 0;
			return total;
		}, `getTotal()`);
	};

	const getById: IGameRepositoryPort["getById"] = (id, props = {}) => {
		return base.run(({ db }) => {
			const query = `SELECT * FROM ${TABLE_NAME} WHERE Id = (?)`;
			const stmt = db.prepare(query);
			const result = stmt.get(id);

			const { success, data: gameModel, error } = z.optional(gameSchema).safeParse(result);

			if (!success) {
				throw base.buildInvalidDataError(error, { entity: "game", operation: "load" });
			}

			if (!gameModel) return null;

			const modelId = GameIdParser.fromTrusted(gameModel.Id);

			const { developerIds, genreIds, platformIds, publisherIds } = _getAllRelationshipEntities(
				[modelId],
				props.load,
			);

			logService.debug(`Found game ${gameModel?.PlayniteName}`);
			return gameMapper.toDomain(gameModel, {
				developerIds: developerIds?.get(modelId),
				publisherIds: publisherIds?.get(modelId),
				genreIds: genreIds?.get(modelId),
				platformIds: platformIds?.get(modelId),
			});
		}, `getById(${id})`);
	};

	const getByPlayniteId: IGameRepositoryPort["getByPlayniteId"] = (id, props = {}) => {
		return base.run(({ db }) => {
			const query = `SELECT * FROM ${TABLE_NAME} WHERE PlayniteId = (?)`;
			const stmt = db.prepare(query);
			const result = stmt.get(id);

			const { success, data: gameModel, error } = z.optional(gameSchema).safeParse(result);

			if (!success) {
				throw base.buildInvalidDataError(error, { entity: "game", operation: "load" });
			}

			if (!gameModel) return null;

			const modelId = GameIdParser.fromTrusted(gameModel.Id);

			const { developerIds, genreIds, platformIds, publisherIds } = _getAllRelationshipEntities(
				[modelId],
				props.load,
			);

			logService.debug(`Found game ${gameModel?.PlayniteName}`);
			return gameMapper.toDomain(gameModel, {
				developerIds: developerIds?.get(modelId),
				publisherIds: publisherIds?.get(modelId),
				genreIds: genreIds?.get(modelId),
				platformIds: platformIds?.get(modelId),
			});
		}, `getByPlayniteId(${id})`);
	};

	const upsert: IGameRepositoryPort["upsert"] = (games) => {
		const result = base._upsert(games);

		for (const [game, model] of result) {
			const modelId = GameIdParser.fromTrusted(model.Id);
			if (game.relationships.developers.isLoaded())
				_updateRelationshipFor({
					relationship: "developers",
					gameId: modelId,
					newRelationshipIds: game.relationships.developers.get(),
				});
			if (game.relationships.publishers.isLoaded())
				_updateRelationshipFor({
					relationship: "publishers",
					gameId: modelId,
					newRelationshipIds: game.relationships.publishers.get(),
				});
			if (game.relationships.genres.isLoaded())
				_updateRelationshipFor({
					relationship: "genres",
					gameId: modelId,
					newRelationshipIds: game.relationships.genres.get(),
				});
			if (game.relationships.platforms.isLoaded())
				_updateRelationshipFor({
					relationship: "platforms",
					gameId: modelId,
					newRelationshipIds: game.relationships.platforms.get(),
				});
		}
	};

	const getManifestData: IGameRepositoryPort["getManifestData"] = () => {
		return base.run(({ db }) => {
			const query = `SELECT PlayniteId as Id, ContentHash FROM ${TABLE_NAME}`;
			const stmt = db.prepare(query);
			const result = stmt.all();

			const { success, data, error } = gameManifestDataSchema.safeParse(result);

			if (!success) {
				throw base.buildInvalidDataError(error, { entity: "game", operation: "load" });
			}

			logService.debug(`Fetched manifest game data, total games in library: ${data.length}`);
			return data;
		}, `getManifestData()`);
	};

	const getTotalPlaytimeSeconds: IGameRepositoryPort["getTotalPlaytimeSeconds"] = (filters) => {
		return base.run(({ db }) => {
			let query = `SELECT SUM(Playtime) as totalPlaytimeSeconds FROM ${TABLE_NAME} `;
			const { where, params } = _getWhereClauseAndParamsFromFilters(filters);
			query += where;
			const stmt = db.prepare(query);
			const result = stmt.get(...params);
			if (!result) return 0;
			const data = result.totalPlaytimeSeconds as number;
			logService.debug(`Calculated total playtime: ${data} seconds`);
			return data;
		}, `getTotalPlaytimeSeconds()`);
	};

	const all: IGameRepositoryPort["all"] = (props = {}) => {
		return base.run(({ db }) => {
			const query = `
          SELECT g.*
          FROM ${TABLE_NAME} g
          ORDER BY g.Id ASC;
        `;
			const stmt = db.prepare(query);
			const rows = stmt.all();

			const { success, data: gameModels, error } = z.array(gameSchema).safeParse(rows);

			if (!success) {
				throw base.buildInvalidDataError(error, { entity: "game", operation: "load" });
			}

			const gameModelsIds = gameModels.map((m) => m.Id).map(GameIdParser.fromTrusted);

			let developerIdsMap: Map<GameId, CompanyId[]> = new Map();
			if (_shouldLoadRelationship(props.load, "developers"))
				developerIdsMap = _getRelationshipsFor({
					relationship: "developers",
					gameIds: gameModelsIds,
				});

			let publisherIdsMap: Map<GameId, CompanyId[]> = new Map();
			if (_shouldLoadRelationship(props.load, "publishers"))
				publisherIdsMap = _getRelationshipsFor({
					relationship: "publishers",
					gameIds: gameModelsIds,
				});

			let genreIdsMap: Map<GameId, GenreId[]> = new Map();
			if (_shouldLoadRelationship(props.load, "genres"))
				genreIdsMap = _getRelationshipsFor({
					relationship: "genres",
					gameIds: gameModelsIds,
				});

			let platformIdsMap: Map<GameId, PlatformId[]> = new Map();
			if (_shouldLoadRelationship(props.load, "platforms"))
				platformIdsMap = _getRelationshipsFor({
					relationship: "platforms",
					gameIds: gameModelsIds,
				});

			const games = gameModels.map((gameModel) => {
				const modelId = GameIdParser.fromTrusted(gameModel.Id);
				const developerIds: CompanyId[] | null = _shouldLoadRelationship(props.load, "developers")
					? (developerIdsMap.get(modelId) ?? [])
					: null;
				const publisherIds: CompanyId[] | null = _shouldLoadRelationship(props.load, "publishers")
					? (publisherIdsMap.get(modelId) ?? [])
					: null;
				const genreIds: GenreId[] | null = _shouldLoadRelationship(props.load, "genres")
					? (genreIdsMap.get(modelId) ?? [])
					: null;
				const platformIds: PlatformId[] | null = _shouldLoadRelationship(props.load, "platforms")
					? (platformIdsMap.get(modelId) ?? [])
					: null;
				return gameMapper.toDomain(gameModel, {
					developerIds,
					publisherIds,
					genreIds,
					platformIds,
				});
			});

			logService.debug(`Found ${games?.length ?? 0} games`);
			return games;
		}, `all()`);
	};

	return {
		...base.public,
		upsert,
		getById,
		getByPlayniteId,
		getTotalPlaytimeSeconds,
		getManifestData,
		getTotal,
		all,
	};
};
