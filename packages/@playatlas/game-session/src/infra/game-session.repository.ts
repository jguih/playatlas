import { DateFilter } from "@playatlas/common/common";
import {
  makeBaseRepository,
  type BaseRepositoryDeps,
} from "@playatlas/common/infra";
import z from "zod";
import { sessionStatus } from "../domain/game-session.constants";
import type { GameSession, GameSessionId } from "../domain/game-session.entity";
import type { GameSessionStatus } from "../domain/game-session.types";
import { gameSessionMapper } from "../game-session.mapper";
import type { IGameSessionRepositoryPort } from "./game-session.repository.port";

export const gameSessionSchema = z.object({
  SessionId: z.string(),
  GameId: z.string().nullable(),
  GameName: z.string().nullable(),
  StartTime: z.string(),
  EndTime: z.string().nullable(),
  Duration: z.number().nullable(),
  Status: z.enum([
    sessionStatus.inProgress,
    sessionStatus.closed,
    sessionStatus.stale,
  ]),
});

export type GameSessionModel = z.infer<typeof gameSessionSchema>;

export type GameSessionFilters = {
  startTime?: DateFilter[];
  status?: {
    op: "in" | "not in";
    types: GameSessionStatus[];
  };
};

export const makeGameSessionRepository = ({
  getDb,
  logService,
}: BaseRepositoryDeps): IGameSessionRepositoryPort => {
  const TABLE_NAME = "game_session";
  const COLUMNS: (keyof GameSessionModel)[] = [
    "SessionId",
    "GameId",
    "StartTime",
    "Duration",
    "EndTime",
    "GameName",
    "Status",
  ];
  const base = makeBaseRepository<GameSessionId, GameSession, GameSessionModel>(
    {
      getDb,
      logService,
      config: {
        tableName: TABLE_NAME,
        idColumn: "SessionId",
        insertColumns: COLUMNS,
        updateColumns: COLUMNS.filter((c) => c !== "SessionId"),
        mapper: gameSessionMapper,
        modelSchema: gameSessionSchema,
      },
    }
  );

  const _getWhereClauseAndParamsFromFilters = (
    filters?: GameSessionFilters
  ) => {
    const where: string[] = [];
    const params: string[] = [];

    if (filters?.startTime) {
      for (const startTimeFilter of filters.startTime) {
        switch (startTimeFilter.op) {
          case "between": {
            where.push(`StartTime >= (?) AND StartTime < (?)`);
            params.push(startTimeFilter.start, startTimeFilter.end);
            break;
          }
          case "eq": {
            where.push(`StartTime = (?)`);
            params.push(startTimeFilter.value);
            break;
          }
          case "gte": {
            where.push(`StartTime >= (?)`);
            params.push(startTimeFilter.value);
            break;
          }
          case "lte": {
            where.push(`StartTime <= (?)`);
            params.push(startTimeFilter.value);
            break;
          }
          case "overlaps": {
            where.push(
              `StartTime < (?) AND (EndTime >= (?) OR EndTime IS NULL)`
            );
            params.push(startTimeFilter.end, startTimeFilter.start);
            break;
          }
        }
      }
    }

    if (filters?.status) {
      const values = filters.status.types;
      const placeholders = values.map(() => "?").join(", ");
      switch (filters.status.op) {
        case "in": {
          where.push(`Status IN (${placeholders})`);
        }
        case "not in": {
          where.push(`Status NOT IN (${placeholders})`);
        }
      }
      params.push(...filters.status.types);
    }

    return {
      where: where.length > 0 ? `WHERE ${where.join(" AND ")}` : "",
      params,
    };
  };

  const add: IGameSessionRepositoryPort["add"] = (session) => {
    base._add(session);
  };

  const update: IGameSessionRepositoryPort["update"] = (session) => {
    base._update(session);
  };

  const getAllBy: IGameSessionRepositoryPort["getAllBy"] = (args) => {
    return base.run(({ db }) => {
      let query = `SELECT * FROM game_session`;
      const { where, params } = _getWhereClauseAndParamsFromFilters(
        args.filters
      );
      query += where;
      query += ` ORDER BY StartTime DESC;`;
      const stmt = db.prepare(query);
      const result = stmt.all(...params);
      const sessions = z.array(gameSessionSchema).parse(result);
      const entities: GameSession[] = [];
      for (const session of sessions) {
        const domainEntity = gameSessionMapper.toDomain(session);
        entities.push(domainEntity);
      }
      return entities;
    }, `getAllBy()`);
  };

  return { ...base.public, add, update, getAllBy };
};
