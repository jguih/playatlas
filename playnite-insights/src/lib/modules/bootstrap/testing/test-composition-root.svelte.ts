import type { IHttpClientPort } from '$lib/modules/common/application/http-client.port';
import type { ILogServicePort } from '$lib/modules/common/application/log-service.port';
import { DateTimeHandler } from '$lib/modules/common/infra/date-time-handler';
import type { IDateTimeHandlerPort } from '$lib/modules/common/infra/date-time-handler.port';
import type { IServerTimeStorePort } from '$lib/modules/common/stores/server-time.store.port';
import { ServerTimeStore } from '$lib/modules/common/stores/server-time.store.svelte';
import type { ClientApi } from '../client-api.svelte';
import type { IClientGameLibraryModulePort } from '../modules/game-library.module.port';
import { ClientGameLibraryModule } from '../modules/game-library.module.svelte';
import type { IClientInfraModulePort } from '../modules/infra.module.port';
import { ClientInfraModule } from '../modules/infra.module.svelte';

export class TestCompositionRoot {
	readonly mocks = {
		logService: {
			debug: vi.fn(),
			error: vi.fn(),
			info: vi.fn(),
			success: vi.fn(),
			warning: vi.fn(),
		} satisfies ILogServicePort,
		httpClient: {
			getAsync: vi.fn(),
			postAsync: vi.fn(),
			putAsync: vi.fn(),
			deleteAsync: vi.fn(),
		} satisfies IHttpClientPort,
	};

	build = (): ClientApi => {
		const serverTimeStore: IServerTimeStorePort = new ServerTimeStore({
			logService: this.mocks.logService,
			httpClient: this.mocks.httpClient,
		});
		const dateTimeHandler: IDateTimeHandlerPort = new DateTimeHandler({ serverTimeStore });

		const infra: IClientInfraModulePort = new ClientInfraModule();
		const gameLibrary: IClientGameLibraryModulePort = new ClientGameLibraryModule({
			dateTimeHandler,
			indexedDbSignal: infra.indexedDbSignal,
		});

		const api: ClientApi = {
			GetGamesQueryHandler: gameLibrary.getGamesQueryHandler,
		};
		return Object.freeze(api);
	};
}
