import type { IAuthServicePort, ISessionIdProvider } from "$lib/modules/auth/application";
import type { ISessionIdRepositoryPort } from "$lib/modules/auth/infra";

export interface IAuthModulePort {
	get authService(): IAuthServicePort;
	get sessionIdProvider(): ISessionIdProvider;
	get sessionIdRepository(): ISessionIdRepositoryPort;
	initializeAsync: () => Promise<void>;
}
