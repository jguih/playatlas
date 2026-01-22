import {
	AuthService,
	SessionIdProvider,
	type IAuthServicePort,
	type ISessionIdProvider,
} from "$lib/modules/auth/application";
import { SessionIdRepository, type ISessionIdRepositoryPort } from "$lib/modules/auth/infra";
import type { IClockPort, IHttpClientPort } from "$lib/modules/common/application";
import type { IAuthModulePort } from "./auth.module.port";

export type AuthModuleDeps = {
	httpClient: IHttpClientPort;
	dbSignal: IDBDatabase;
	clock: IClockPort;
};

export class AuthModule implements IAuthModulePort {
	readonly authService: IAuthServicePort;
	readonly sessionIdRepository: ISessionIdRepositoryPort;
	readonly sessionIdProvider: ISessionIdProvider;

	constructor({ httpClient, dbSignal, clock }: AuthModuleDeps) {
		this.authService = new AuthService({ httpClient });
		this.sessionIdRepository = new SessionIdRepository({ dbSignal });
		this.sessionIdProvider = new SessionIdProvider({
			sessionIdRepository: this.sessionIdRepository,
			clock,
		});
	}

	initializeAsync = async (): Promise<void> => {
		await this.sessionIdProvider.loadFromDbAsync();
	};
}
