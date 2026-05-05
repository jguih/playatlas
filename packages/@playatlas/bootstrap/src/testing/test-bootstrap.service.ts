import type { IDomainEventBusPort, ILogServicePort } from "@playatlas/common/application";
import type { IGameLibraryModulePort } from "../application/modules/game-library.module.port";
import { type IInfraModulePort } from "../application/modules/infra.module.port";
import type { ISystemModulePort } from "../application/modules/system.module.port";
import type { ISeedDataModulePort } from "./modules/seed-data.module.port";
import type { ITestFactoryModulePort } from "./modules/test-factory.module";
import type { TestClock } from "./test-clock";
import type { TestDoubleServices } from "./test.api.types";
import type { PlayAtlasTestApiV1 } from "./test.api.v1";

export type BootstrapTestApiDeps = {
	modules: {
		infra: IInfraModulePort;
		gameLibrary: IGameLibraryModulePort;
		system: ISystemModulePort;
		testFactory: ITestFactoryModulePort;
		seedData: ISeedDataModulePort;
	};
	backendLogService: ILogServicePort;
	eventBus: IDomainEventBusPort;
	clock: TestClock;
	testDoubleServices: TestDoubleServices;
};

export const bootstrapTestApiV1 = ({
	modules: { testFactory, gameLibrary, seedData, infra, system },
	clock,
	backendLogService,
	testDoubleServices,
}: BootstrapTestApiDeps): PlayAtlasTestApiV1 => {
	const _cleanup = async () => {
		const dataDir = system.getEnvService().getDataDir();
		backendLogService.warning(`Deleting integration test data dir at ${dataDir}`);
		await infra.getFsService().rm(dataDir, { force: true, recursive: true });
	};

	const _reset_db_async = async () => {
		infra.getDb().close();
		await infra.initDb();
	};

	const api: PlayAtlasTestApiV1 = {
		factory: testFactory,
		getClock: () => clock,
		gameLibrary: {
			commands: {
				getApplyDefaultClassificationsCommandHandler:
					gameLibrary.scoreEngine.commands.getApplyDefaultClassificationsCommandHandler,
			},
			scoreEngine: {
				getHorrorScoreEngine: () => testDoubleServices.gameLibrary.scoreEngine.horror,
				getScoreBreakdownNormalizer: gameLibrary.scoreEngine.getScoreBreakdownNormalizer,
				evidenceExtractors: {
					getRunBasedEvidenceExtractor:
						gameLibrary.scoreEngine.evidenceExtractors.getRunBasedEvidenceExtractor,
				},
			},
		},
		data: {
			getGameRelationshipOptions: testFactory.getGameRelationshipOptions,
		},
		seed: seedData,
		cleanup: _cleanup,
		resetDbAsync: _reset_db_async,
	};

	return Object.freeze(api);
};
