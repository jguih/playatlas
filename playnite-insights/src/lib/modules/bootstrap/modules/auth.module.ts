import {
	AuthFlow,
	AuthService,
	SessionIdMapper,
	SessionIdProvider,
	type IAuthFlowPort,
	type IAuthServicePort,
	type ISessionIdMapperPort,
	type ISessionIdProviderPort,
} from "$lib/modules/auth/application";
import { SessionIdRepository, type ISessionIdRepositoryPort } from "$lib/modules/auth/infra";
import type { IClockPort, IHttpClientPort, ILogServicePort } from "$lib/modules/common/application";
import type { IAuthModulePort } from "./auth.module.port";

export type AuthModuleDeps = {
	httpClient: IHttpClientPort;
	dbSignal: IDBDatabase;
	clock: IClockPort;
	logService: ILogServicePort;
};

export class AuthModule implements IAuthModulePort {
	readonly authService: IAuthServicePort;

	readonly sessionIdMapper: ISessionIdMapperPort;
	readonly sessionIdRepository: ISessionIdRepositoryPort;
	readonly sessionIdProvider: ISessionIdProviderPort;

	readonly authFlow: IAuthFlowPort;

	constructor({ httpClient, dbSignal, clock, logService }: AuthModuleDeps) {
		this.authService = new AuthService({ httpClient });

		this.sessionIdMapper = new SessionIdMapper();
		this.sessionIdRepository = new SessionIdRepository({
			dbSignal,
			sessionIdMapper: this.sessionIdMapper,
		});
		this.sessionIdProvider = new SessionIdProvider({
			sessionIdRepository: this.sessionIdRepository,
			clock,
		});

		this.authFlow = new AuthFlow({
			authService: this.authService,
			sessionIdProvider: this.sessionIdProvider,
			logService,
		});
	}

	initializeAsync = async (): Promise<void> => {
		await this.sessionIdProvider.loadFromDbAsync();
	};
}
