import type { IHttpClientPort, ILogServicePort } from '$lib/modules/common/application';
import { DateTimeHandler, type IDateTimeHandlerPort } from '$lib/modules/common/infra';
import { ServerTimeStore, type IServerTimeStorePort } from '$lib/modules/common/stores';
import { GameFactory } from '$lib/modules/game-library/testing/game-factory';
import { type ClientApi } from '../application/client-api.svelte';
import { ClientBootstrapper } from '../application/client-bootstrapper.svelte';
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
	readonly factories = {
		game: new GameFactory(),
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

		const bootstrapper = new ClientBootstrapper({ modules: { infra, gameLibrary } });
		return bootstrapper.bootstrap();
	};

	cleanup = async (): Promise<void> => {
		const dbs = await indexedDB.databases();

		await Promise.all(
			dbs.map(
				(db) =>
					new Promise<void>((resolve) => {
						const req = indexedDB.deleteDatabase(db.name!);
						req.onsuccess = req.onerror = req.onblocked = () => resolve();
					}),
			),
		);
	};
}
