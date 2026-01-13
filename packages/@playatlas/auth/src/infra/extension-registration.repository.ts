import { ISODateSchema } from "@playatlas/common/common";
import type { ExtensionRegistrationId } from "@playatlas/common/domain";
import type {
  BaseRepositoryDeps} from "@playatlas/common/infra";
import {
  makeBaseRepository,
} from "@playatlas/common/infra";
import z from "zod";
import { extensionRegistrationStatus } from "../domain/extension-registration.constants";
import type { ExtensionRegistration } from "../domain/extension-registration.entity";
import { extensionRegistrationMapper } from "../extension-registration.mapper";
import type { IExtensionRegistrationRepositoryPort } from "./extension-registration.repository.port";

export const extensionRegistrationSchema = z.object({
  Id: z.number(), // AUTO-INCREMENT
  ExtensionId: z.string(),
  PublicKey: z.string(),
  Hostname: z.string().nullable(),
  Os: z.string().nullable(),
  ExtensionVersion: z.string().nullable(),
  Status: z.nativeEnum(extensionRegistrationStatus),
  CreatedAt: ISODateSchema,
  LastUpdatedAt: ISODateSchema,
});

export type ExtensionRegistrationModel = z.infer<
  typeof extensionRegistrationSchema
>;

export const makeExtensionRegistrationRepository = ({
  getDb,
  logService,
}: BaseRepositoryDeps): IExtensionRegistrationRepositoryPort => {
  const TABLE_NAME = `extension_registration`;
  const COLUMNS: (keyof ExtensionRegistrationModel)[] = [
    "Id",
    "ExtensionId",
    "PublicKey",
    "Hostname",
    "Os",
    "ExtensionVersion",
    "Status",
    "CreatedAt",
    "LastUpdatedAt",
  ];
  const base = makeBaseRepository<
    ExtensionRegistrationId,
    ExtensionRegistration,
    ExtensionRegistrationModel
  >({
    getDb,
    logService,
    config: {
      tableName: TABLE_NAME,
      idColumn: "Id",
      autoIncrementId: true,
      insertColumns: COLUMNS.slice(1),
      updateColumns: COLUMNS.filter((c) => c !== "Id" && c !== "CreatedAt"),
      mapper: extensionRegistrationMapper,
      modelSchema: extensionRegistrationSchema,
    },
  });

  const add: IExtensionRegistrationRepositoryPort["add"] = (entity) => {
    const results = base._add(entity);
    for (const [entity, _, { lastInsertRowid }] of results)
      entity.setId(lastInsertRowid as ExtensionRegistrationId);
  };

  const update: IExtensionRegistrationRepositoryPort["update"] = (entity) => {
    base._update(entity);
  };

  const upsert: IExtensionRegistrationRepositoryPort["upsert"] = (entity) => {
    base._upsert(entity);
  };

  const getByExtensionId: IExtensionRegistrationRepositoryPort["getByExtensionId"] =
    (extensionId) => {
      const query = `SELECT * FROM ${TABLE_NAME} WHERE ExtensionId = ?`;
      return base.run(({ db }) => {
        const stmt = db.prepare(query);
        const result = stmt.get(extensionId);
        if (!result) return null;
        const extensionRegistration = extensionRegistrationSchema.parse(result);
        return extensionRegistrationMapper.toDomain(extensionRegistration);
      }, `getByExtensionId(${extensionId})`);
    };

  return {
    ...base.public,
    getByExtensionId,
    add,
    update,
    upsert,
  };
};
