import type {
	IAuthFlowPort,
	IAuthServicePort,
	ISessionIdMapperPort,
	ISessionIdProviderPort,
} from "$lib/modules/auth/application";
import type { ISessionIdRepositoryPort } from "$lib/modules/auth/infra";

export interface IAuthModulePort {
	get authService(): IAuthServicePort;

	get sessionIdMapper(): ISessionIdMapperPort;
	get sessionIdProvider(): ISessionIdProviderPort;
	get sessionIdRepository(): ISessionIdRepositoryPort;

	get authFlow(): IAuthFlowPort;

	initializeAsync: () => Promise<void>;
}
