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
import type { IDomainEventBusPort } from "$lib/modules/common/application/event-bus.port";
import type { IAuthModulePort } from "./auth.module.port";

export type AuthModuleDeps = {
	httpClient: IHttpClientPort;
	dbSignal: IDBDatabase;
	clock: IClockPort;
	logService: ILogServicePort;
	eventBus: IDomainEventBusPort;
};

export class AuthModule implements IAuthModulePort {
	readonly authService: IAuthServicePort;

	readonly sessionIdMapper: ISessionIdMapperPort;
	readonly sessionIdRepository: ISessionIdRepositoryPort;
	readonly sessionIdProvider: ISessionIdProviderPort;

	readonly authFlow: IAuthFlowPort;

	constructor({ httpClient, dbSignal, clock, logService, eventBus }: AuthModuleDeps) {
		this.sessionIdMapper = new SessionIdMapper();
		this.sessionIdRepository = new SessionIdRepository({
			dbSignal,
			sessionIdMapper: this.sessionIdMapper,
		});
		this.sessionIdProvider = new SessionIdProvider({
			sessionIdRepository: this.sessionIdRepository,
			clock,
		});

		this.authService = new AuthService({ httpClient });

		this.authFlow = new AuthFlow({
			authService: this.authService,
			sessionIdProvider: this.sessionIdProvider,
			logService,
			clock,
			eventBus,
		});
	}

	initializeAsync = async (): Promise<void> => {
		await this.sessionIdProvider.loadFromDbAsync();
	};

	hasSession: IAuthModulePort["hasSession"] = () => {
		return this.sessionIdProvider.hasSession();
	};
}
