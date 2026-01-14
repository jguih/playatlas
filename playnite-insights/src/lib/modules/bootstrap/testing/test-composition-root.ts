import type { IHttpClientPort, ILogServicePort } from "$lib/modules/common/application";
import {
	companyRepositorySchema,
	gameRepositorySchema,
	genreRepositorySchema,
	platformRepositorySchema,
} from "$lib/modules/game-library/infra";
import { GameFactory, GenreFactory } from "$lib/modules/game-library/testing";
import { CompanyFactory } from "$lib/modules/game-library/testing/company-factory";
import { PlatformFactory } from "$lib/modules/game-library/testing/platform-factory";
import { type ClientApi } from "../application/client-api.svelte";
import { ClientBootstrapper } from "../application/client-bootstrapper";
import { ClientGameLibraryModule } from "../modules/game-library.module";
import type { IClientGameLibraryModulePort } from "../modules/game-library.module.port";
import type { IClientInfraModulePort } from "../modules/infra.module.port";
import { ClientInfraModule } from "../modules/infra.module.svelte";

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
		genre: new GenreFactory(),
		company: new CompanyFactory(),
		platform: new PlatformFactory(),
	};

	build = (): ClientApi => {
		const infra: IClientInfraModulePort = new ClientInfraModule({
			logService: this.mocks.logService,
			schemas: [
				gameRepositorySchema,
				genreRepositorySchema,
				companyRepositorySchema,
				platformRepositorySchema,
			],
		});
		infra.initialize();

		const gameLibrary: IClientGameLibraryModulePort = new ClientGameLibraryModule({
			indexedDbSignal: infra.indexedDbSignal,
			httpClient: this.mocks.httpClient,
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
