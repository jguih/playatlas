import type { IGameLibraryModulePort } from "../../application/modules/game-library.module.port";
import type { ISeedDataModulePort } from "./seed-data.module.port";

export type SeedDataModuleDeps = {
	gameLibrary: IGameLibraryModulePort;
};

export const makeSeedDataModule = ({ gameLibrary }: SeedDataModuleDeps): ISeedDataModulePort => {
	const seedCompany: ISeedDataModulePort["seedCompany"] = (company) => {
		gameLibrary.getCompanyRepository().upsert(company);
	};

	const seedGame: ISeedDataModulePort["seedGame"] = (game) => {
		gameLibrary.getGameRepository().upsert(game);
	};

	const seedGenre: ISeedDataModulePort["seedGenre"] = (genre) => {
		gameLibrary.getGenreRepository().upsert(genre);
	};

	const seedPlatform: ISeedDataModulePort["seedPlatform"] = (platform) => {
		gameLibrary.getPlatformRepository().upsert(platform);
	};

	const seedCompletionStatus: ISeedDataModulePort["seedCompletionStatus"] = (completionStatus) => {
		gameLibrary.getCompletionStatusRepository().upsert(completionStatus);
	};

	const seedTags: ISeedDataModulePort["seedTags"] = (tag) => {
		gameLibrary.getTagRepository().upsert(tag);
	};

	const seedGameRelationships: ISeedDataModulePort["seedGameRelationships"] = (
		gameRelationshipOptions,
	) => {
		const { companyList, completionStatusList, genreList, platformList, tagList } =
			gameRelationshipOptions;

		gameLibrary.getCompletionStatusRepository().upsert(completionStatusList);
		gameLibrary.getCompanyRepository().upsert(companyList);
		gameLibrary.getGenreRepository().upsert(genreList);
		gameLibrary.getPlatformRepository().upsert(platformList);
		gameLibrary.getTagRepository().upsert(tagList);
	};

	const seedDefaultClassifications: ISeedDataModulePort["seedDefaultClassifications"] = () => {
		gameLibrary.scoreEngine.commands
			.getApplyDefaultClassificationsCommandHandler()
			.execute({ type: "default" });
	};

	return {
		seedCompany,
		seedCompletionStatus,
		seedDefaultClassifications,
		seedGame,
		seedGameRelationships,
		seedGenre,
		seedPlatform,
		seedTags,
	};
};
