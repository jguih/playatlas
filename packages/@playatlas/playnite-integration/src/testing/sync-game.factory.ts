import { faker } from "@faker-js/faker";
import type { TestEntityFactory } from "@playatlas/common/testing";
import type {
	SyncGamesRequestDtoItem,
	SyncGamesRequestDtoItemCompany,
	SyncGamesRequestDtoItemCompletionStatus,
	SyncGamesRequestDtoItemGenre,
	SyncGamesRequestDtoItemPlatform,
	SyncGamesRequestDtoItemTag,
} from "../commands";

export type SyncGamesRequestDtoFactory = TestEntityFactory<undefined, SyncGamesRequestDtoItem> & {
	genreOptions: SyncGamesRequestDtoItemGenre[];
	completionStatusOptions: SyncGamesRequestDtoItemCompletionStatus[];
	companyOptions: SyncGamesRequestDtoItemCompany[];
	platformOptions: SyncGamesRequestDtoItemPlatform[];
	tagOptions: SyncGamesRequestDtoItemTag[];
};

export const makeSyncGamesRequestDtoFactory = (): SyncGamesRequestDtoFactory => {
	const completionStatusOptions: SyncGamesRequestDtoItemCompletionStatus[] = [
		{ Id: faker.string.uuid(), Name: "playing" },
		{ Id: faker.string.uuid(), Name: "completed" },
		{ Id: faker.string.uuid(), Name: "abandoned" },
		{ Id: faker.string.uuid(), Name: "played" },
		{ Id: faker.string.uuid(), Name: "to play" },
	];

	const buildGenreDto = (n: number): SyncGamesRequestDtoItemGenre[] => {
		return Array.from({ length: n }, () => ({ Id: faker.string.uuid(), Name: faker.book.genre() }));
	};

	const genreOptions: SyncGamesRequestDtoItemGenre[] = buildGenreDto(1000);

	const buildTagDto = (n: number): SyncGamesRequestDtoItemTag[] => {
		return Array.from({ length: n }, () => ({
			Id: faker.string.uuid(),
			Name: faker.lorem.words({ min: 1, max: 2 }),
		}));
	};

	const tagOptions: SyncGamesRequestDtoItemTag[] = buildTagDto(1000);

	const buildCompanyDto = (n: number): SyncGamesRequestDtoItemCompany[] => {
		return Array.from({ length: n }, () => ({
			Id: faker.string.uuid(),
			Name: faker.company.name(),
		}));
	};

	const companyOptions: SyncGamesRequestDtoItemCompany[] = buildCompanyDto(1000);

	const buildPlatformDto = (n: number): SyncGamesRequestDtoItemPlatform[] => {
		return Array.from({ length: n }, () => ({
			Id: faker.string.uuid(),
			Name: faker.lorem.words({ min: 2, max: 3 }),
			SpecificationId: faker.string.uuid(),
			Background: faker.image.url(),
			Cover: faker.image.url(),
			Icon: faker.image.url(),
		}));
	};

	const platformOptions: SyncGamesRequestDtoItemPlatform[] = buildPlatformDto(50);

	const buildItem = (): SyncGamesRequestDtoItem => {
		const genres = faker.helpers.arrayElements(genreOptions, { min: 2, max: 15 });
		const companies = faker.helpers.arrayElements(companyOptions, { min: 1, max: 3 });
		const platforms = faker.helpers.arrayElements(platformOptions, { min: 1, max: 5 });
		const tags = faker.helpers.arrayElements(tagOptions, { min: 3, max: 15 });

		return {
			Id: faker.string.uuid(),
			ContentHash: faker.string.uuid(),
			Hidden: faker.datatype.boolean(),
			IsInstalled: faker.datatype.boolean(),
			Playtime: faker.number.int({ min: 0 }),
			Added: faker.date.past().toISOString(),
			BackgroundImage: faker.image.url(),
			CoverImage: faker.image.url(),
			Icon: faker.image.url(),
			Description: faker.lorem.paragraphs({ min: 1, max: 10 }),
			InstallDirectory: faker.system.filePath(),
			Name: faker.book.title(),
			LastActivity: faker.date.recent().toISOString(),
			ReleaseDate: faker.date.past().toISOString(),
			CompletionStatus: faker.helpers.arrayElement([...completionStatusOptions, null, undefined]),
			Genres: faker.helpers.arrayElement([genres, null, undefined]),
			Developers: faker.helpers.arrayElement([companies, null, undefined]),
			Publishers: faker.helpers.arrayElement([companies, null, undefined]),
			Platforms: faker.helpers.arrayElement([platforms, null, undefined]),
			Tags: faker.helpers.arrayElement([tags, null, undefined]),
		};
	};

	return {
		build: buildItem,
		buildList: (n) => {
			return Array.from({ length: n }, () => buildItem());
		},
		genreOptions,
		completionStatusOptions,
		companyOptions,
		platformOptions,
		tagOptions,
	};
};
