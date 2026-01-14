import {
	makeExtensionRegistrationFactory,
	type ExtensionRegistrationFactory,
} from "@playatlas/auth/testing";
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

export type ITestFactoryModulePort = {
	getCompletionStatusFactory: () => CompletionStatusFactory;
	getGenreFactory: () => GenreFactory;
	getCompanyFactory: () => CompanyFactory;
	getGameFactory: () => GameFactory;
	setGameFactory: (factory: GameFactory) => void;
	getPlatformFactory: () => PlatformFactory;
	getExtensionRegistrationFactory: () => ExtensionRegistrationFactory;
};

export const makeTestFactoryModule = (): ITestFactoryModulePort => {
	const _completion_status = makeCompletionStatusFactory();
	const _genre = makeGenreFactory();
	const _company = makeCompanyFactory();
	let _game_factory: GameFactory | null = null;
	const _platform = makePlatformFactory();
	const _extension_registration_factory = makeExtensionRegistrationFactory();

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
	};
};
