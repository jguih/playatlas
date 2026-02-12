import type { IExtensionRegistrationFactoryPort } from "@playatlas/auth/application";
import {
	makeExtensionRegistrationFactory,
	type ExtensionRegistrationFactory,
} from "@playatlas/auth/testing";
import type { IClockPort } from "@playatlas/common/infra";
import {
	type ICompanyFactoryPort,
	type ICompletionStatusFactoryPort,
	type IGenreFactoryPort,
	type IPlatformFactoryPort,
	type ITagFactoryPort,
} from "@playatlas/game-library/application";
import {
	makeGenreFactory,
	makePlatformFactory,
	makeTestCompanyFactory,
	makeTestCompletionStatusFactory,
	makeTestTagFactory,
	type GenreFactory,
	type PlatformFactory,
	type TestCompanyFactory,
	type TestCompletionStatusFactory,
	type TestGameFactory,
	type TestTagFactory,
} from "@playatlas/game-library/testing";
import {
	makeSyncGamesRequestDtoFactory,
	type SyncGamesRequestDtoFactory,
} from "@playatlas/playnite-integration/testing";

export type ITestFactoryModulePort = {
	getCompletionStatusFactory: () => TestCompletionStatusFactory;
	getGenreFactory: () => GenreFactory;
	getCompanyFactory: () => TestCompanyFactory;
	getTagFactory: () => TestTagFactory;
	getGameFactory: () => TestGameFactory;
	setGameFactory: (factory: TestGameFactory) => void;
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
	tagFactory: ITagFactoryPort;
	clock: IClockPort;
};

export const makeTestFactoryModule = (deps: TestFactoryModuleDeps): ITestFactoryModulePort => {
	const _completion_status = makeTestCompletionStatusFactory(deps);
	const _genre = makeGenreFactory(deps);
	const _company = makeTestCompanyFactory(deps);
	const _tag_factory = makeTestTagFactory(deps);
	let _game_factory: TestGameFactory | null = null;
	const _platform = makePlatformFactory(deps);
	const _extension_registration_factory = makeExtensionRegistrationFactory(deps);
	const _sync_game_dto_factory = makeSyncGamesRequestDtoFactory();

	return {
		getCompletionStatusFactory: () => _completion_status,
		getGenreFactory: () => _genre,
		getCompanyFactory: () => _company,
		getTagFactory: () => _tag_factory,
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
