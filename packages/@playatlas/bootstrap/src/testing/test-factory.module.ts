import type { IExtensionRegistrationFactoryPort } from "@playatlas/auth/application";
import {
	makeExtensionRegistrationFactory,
	type ExtensionRegistrationFactory,
} from "@playatlas/auth/testing";
import type { IClockPort } from "@playatlas/common/infra";
import type {
	ICompanyFactoryPort,
	ICompletionStatusFactoryPort,
	IGenreFactoryPort,
	IPlatformFactoryPort,
} from "@playatlas/game-library/application";
import {
	makeCompanyFactory,
	makeCompletionStatusFactory,
	makeGenreFactory,
	makePlatformFactory,
	type CompanyFactory,
	type CompletionStatusFactory,
	type GameFactory,
	type GenreFactory,
	type PlatformFactory,
} from "@playatlas/game-library/testing";
import {
	makeSyncGamesRequestDtoFactory,
	type SyncGamesRequestDtoFactory,
} from "@playatlas/playnite-integration/testing";

export type ITestFactoryModulePort = {
	getCompletionStatusFactory: () => CompletionStatusFactory;
	getGenreFactory: () => GenreFactory;
	getCompanyFactory: () => CompanyFactory;
	getGameFactory: () => GameFactory;
	setGameFactory: (factory: GameFactory) => void;
	getPlatformFactory: () => PlatformFactory;
	getExtensionRegistrationFactory: () => ExtensionRegistrationFactory;
	getSyncGameRequestDtoFactory: () => SyncGamesRequestDtoFactory;
};

export type TestFactoryModuleDeps = {
	companyFactory: ICompanyFactoryPort;
	completionStatusFactory: ICompletionStatusFactoryPort;
	platformFactory: IPlatformFactoryPort;
	genreFactory: IGenreFactoryPort;
	extensionRegistrationFactory: IExtensionRegistrationFactoryPort;
	clock: IClockPort;
};

export const makeTestFactoryModule = (deps: TestFactoryModuleDeps): ITestFactoryModulePort => {
	const _completion_status = makeCompletionStatusFactory(deps);
	const _genre = makeGenreFactory(deps);
	const _company = makeCompanyFactory(deps);
	let _game_factory: GameFactory | null = null;
	const _platform = makePlatformFactory(deps);
	const _extension_registration_factory = makeExtensionRegistrationFactory(deps);
	const _sync_game_dto_factory = makeSyncGamesRequestDtoFactory();

	return {
		getCompletionStatusFactory: () => _completion_status,
		getGenreFactory: () => _genre,
		getCompanyFactory: () => _company,
		getGameFactory: () => {
			if (!_game_factory) throw new Error("Game Factory not set.");
			return _game_factory;
		},
		setGameFactory: (factory) => (_game_factory = factory),
		getPlatformFactory: () => _platform,
		getExtensionRegistrationFactory: () => _extension_registration_factory,
		getSyncGameRequestDtoFactory: () => _sync_game_dto_factory,
	};
};
