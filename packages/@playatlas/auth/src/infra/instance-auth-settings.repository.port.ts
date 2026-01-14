import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type {
	InstanceAuthSettings,
	InstanceAuthSettingsId,
} from "../domain/instance-auth-settings.entity";

export type InstanceAuthSettingsRepository = Omit<
	IEntityRepositoryPort<InstanceAuthSettingsId, InstanceAuthSettings>,
	"add" | "update" | "exists"
> & {
	get: () => InstanceAuthSettings | null;
};
