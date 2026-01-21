import type { EntityMapper } from "@playatlas/common/application";
import { SessionIdParser } from "../domain";
import { type InstanceSession } from "../domain/instance-session.entity";
import type { InstanceSessionModel } from "../infra/instance-session.repository";
import type { IInstanceSessionFactoryPort } from "./instance-session.factory";

export type IInstanceSessionMapperPort = EntityMapper<InstanceSession, InstanceSessionModel>;

export type InstanceSessionMapperDeps = {
	instanceSessionFactory: IInstanceSessionFactoryPort;
};

export const makeInstanceSessionMapper = ({
	instanceSessionFactory,
}: InstanceSessionMapperDeps): IInstanceSessionMapperPort => {
	return {
		toDomain: (model) => {
			const entity: InstanceSession = instanceSessionFactory.rehydrate({
				sessionId: SessionIdParser.fromTrusted(model.Id),
				createdAt: new Date(model.CreatedAt),
				lastUsedAt: new Date(model.LastUsedAt),
				lastUpdatedAt: new Date(model.LastUpdatedAt),
			});
			return entity;
		},
		toPersistence: (entity) => {
			const model: InstanceSessionModel = {
				Id: entity.getId(),
				CreatedAt: entity.getCreatedAt().toISOString(),
				LastUsedAt: entity.getLastUsedAt().toISOString(),
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
			};
			return model;
		},
	};
};
