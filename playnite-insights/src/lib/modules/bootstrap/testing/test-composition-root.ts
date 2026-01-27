import { sessionIdRepositorySchema } from "$lib/modules/auth/infra";
import type { IHttpClientPort, ILogServicePort } from "$lib/modules/common/application";
import {
	companyRepositorySchema,
	completionStatusRepositorySchema,
	gameRepositorySchema,
	genreRepositorySchema,
	platformRepositorySchema,
} from "$lib/modules/game-library/infra";
import {
	CompanyFactory,
	CompletionStatusFactory,
	GameFactory,
	GenreFactory,
	PlatformFactory,
} from "$lib/modules/game-library/testing";
import { type ClientApiV1 } from "../application/client-api.v1";
import { ClientBootstrapper } from "../application/client-bootstrapper";
import { AuthModule } from "../modules/auth.module";
import type { IAuthModulePort } from "../modules/auth.module.port";
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
		completionStatus: new CompletionStatusFactory(),
	};

	buildAsync = async (): Promise<ClientApiV1> => {
		const infra: IClientInfraModulePort = new ClientInfraModule({
			logService: this.mocks.logService,
			schemas: [
				gameRepositorySchema,
				genreRepositorySchema,
				companyRepositorySchema,
				platformRepositorySchema,
				sessionIdRepositorySchema,
				completionStatusRepositorySchema,
			],
		});
		await infra.initializeAsync();

		const auth: IAuthModulePort = new AuthModule({
			httpClient: this.mocks.httpClient,
			dbSignal: infra.dbSignal,
			clock: infra.clock,
			logService: this.mocks.logService,
		});
		await auth.initializeAsync();

		const gameLibrary: IClientGameLibraryModulePort = new ClientGameLibraryModule({
			dbSignal: infra.dbSignal,
			httpClient: this.mocks.httpClient,
			clock: infra.clock,
		});

		const bootstrapper = new ClientBootstrapper({ modules: { infra, gameLibrary, auth } });
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
