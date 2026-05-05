import type { IExtensionRegistrationFactoryPort } from "@playatlas/auth/application";
import {
	makeExtensionRegistrationFactory,
	type ExtensionRegistrationFactory,
} from "@playatlas/auth/testing";
import type { IClockPort } from "@playatlas/common/infra";
import {
	type ICompanyFactoryPort,
	type ICompletionStatusFactoryPort,
	type IGameFactoryPort,
	type IGameMapperPort,
	type IGenreFactoryPort,
	type IPlatformFactoryPort,
	type ITagFactoryPort,
} from "@playatlas/game-library/application";
import {
	makeGenreFactory,
	makePlatformFactory,
	makeTestCompanyFactory,
	makeTestCompletionStatusFactory,
	makeTestGameFactory,
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
import type { GameRelationshipOptions } from "../test.api.types";

export type ITestFactoryModulePort = {
	getCompletionStatusFactory: () => TestCompletionStatusFactory;
	getGenreFactory: () => GenreFactory;
	getCompanyFactory: () => TestCompanyFactory;
	getTagFactory: () => TestTagFactory;
	getGameFactory: () => TestGameFactory;
	getPlatformFactory: () => PlatformFactory;
	getExtensionRegistrationFactory: () => ExtensionRegistrationFactory;
	getSyncGameRequestDtoFactory: () => SyncGamesRequestDtoFactory;
	getGameRelationshipOptions: () => GameRelationshipOptions;
	init: () => void;
};

export type TestFactoryModuleDeps = {
	companyFactory: ICompanyFactoryPort;
	completionStatusFactory: ICompletionStatusFactoryPort;
	platformFactory: IPlatformFactoryPort;
	genreFactory: IGenreFactoryPort;
	extensionRegistrationFactory: IExtensionRegistrationFactoryPort;
	tagFactory: ITagFactoryPort;
	clock: IClockPort;
	gameMapper: IGameMapperPort;
	gameFactory: IGameFactoryPort;
};

export const makeTestFactoryModule = (deps: TestFactoryModuleDeps): ITestFactoryModulePort => {
	const _completion_status_factory = makeTestCompletionStatusFactory(deps);
	const _genre_factory = makeGenreFactory(deps);
	const _company_factory = makeTestCompanyFactory(deps);
	const _tag_factory = makeTestTagFactory(deps);
	let _game_factory: TestGameFactory | null = null;
	const _platform_factory = makePlatformFactory(deps);
	const _extension_registration_factory = makeExtensionRegistrationFactory(deps);
	const _sync_game_dto_factory = makeSyncGamesRequestDtoFactory();

	const _build_game_relationship_options = (): GameRelationshipOptions => {
		const completionStatusList = _completion_status_factory.buildDefaultList();
		const companyList = _company_factory.buildList(200);
		const genreList = _genre_factory.buildList(200);
		const platformList = _platform_factory.buildList(30);
		const tagList = _tag_factory.buildList(1000);

		return {
			companyList,
			completionStatusList,
			genreList,
			platformList,
			tagList,
		};
	};

	const _setup_game_factory = (gameRelationshipOptions: GameRelationshipOptions) => {
		const { companyList, completionStatusList, genreList, platformList, tagList } =
			gameRelationshipOptions;

		const completionStatusOptions = completionStatusList.map((c) => c.getId());
		const companyOptions = companyList.map((c) => c.getId());
		const genreOptions = genreList.map((g) => g.getId());
		const platformOptions = platformList.map((p) => p.getId());
		const tagOptions = tagList.map((t) => t.getId());

		_game_factory = makeTestGameFactory({
			companyOptions,
			completionStatusOptions,
			genreOptions,
			platformOptions,
			tagOptions,
			gameFactory: deps.gameFactory,
			gameMapper: deps.gameMapper,
		});
	};

	const _game_relationship_options = _build_game_relationship_options();

	return {
		getCompletionStatusFactory: () => _completion_status_factory,
		getGenreFactory: () => _genre_factory,
		getCompanyFactory: () => _company_factory,
		getTagFactory: () => _tag_factory,
		getGameFactory: () => {
			if (!_game_factory) throw new Error("Game Factory not set.");
			return _game_factory;
		},
		getPlatformFactory: () => _platform_factory,
		getExtensionRegistrationFactory: () => _extension_registration_factory,
		getSyncGameRequestDtoFactory: () => _sync_game_dto_factory,
		getGameRelationshipOptions: () => _game_relationship_options,
		init: () => {
			_setup_game_factory(_game_relationship_options);
		},
	};
};
