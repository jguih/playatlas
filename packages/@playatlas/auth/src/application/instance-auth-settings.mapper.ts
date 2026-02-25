import type { EntityMapper } from "@playatlas/common/application";
import type { InstanceAuthSettings } from "../domain/instance-auth-settings.entity";
import type { InstanceAuthSettingsModel } from "../infra/instance-auth-settings.repository";
import type { IInstanceAuthSettingsFactoryPort } from "./instance-auth-settings.factory";

export type IInstanceAuthSettingsMapperPort = EntityMapper<
	InstanceAuthSettings,
	InstanceAuthSettingsModel
>;

export type InstanceAuthSettingsMapperDeps = {
	instanceAuthSettingsFactory: IInstanceAuthSettingsFactoryPort;
};

export const makeInstanceAuthSettingsMapper = ({
	instanceAuthSettingsFactory,
}: InstanceAuthSettingsMapperDeps): IInstanceAuthSettingsMapperPort => {
	return {
		toPersistence: (entity) => {
			const model: InstanceAuthSettingsModel = {
				Id: entity.getId(),
				PasswordHash: entity.getPasswordHash(),
				Salt: entity.getSalt(),
				CreatedAt: entity.getCreatedAt().toISOString(),
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
			};
			return model;
		},
		toDomain: (model) => {
			const entity = instanceAuthSettingsFactory.rehydrate({
				passwordHash: model.PasswordHash,
				salt: model.Salt,
				createdAt: new Date(model.CreatedAt),
				lastUpdatedAt: new Date(model.LastUpdatedAt),
			});
			return entity;
		},
	};
};
