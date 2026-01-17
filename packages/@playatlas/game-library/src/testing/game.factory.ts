import { faker } from "@faker-js/faker";
import {
	GameIdParser,
	PlayniteGameIdParser,
	type CompanyId,
	type CompletionStatusId,
	type GenreId,
	type PlatformId,
} from "@playatlas/common/domain";
import type { TestEntityFactory } from "@playatlas/common/testing";
import type { IGameFactoryPort, IGameMapperPort } from "../application";
import { type Game } from "../domain/game.entity";
import { type MakeGameProps } from "../domain/game.entity.types";
import type { PlayniteProjectionResponseDto } from "../dtos";

export type GameFactoryDeps = {
	completionStatusOptions: CompletionStatusId[];
	companyOptions: CompanyId[];
	genreOptions: GenreId[];
	platformOptions: PlatformId[];
	gameFactory: IGameFactoryPort;
	gameMapper: IGameMapperPort;
};

export type GameFactory = TestEntityFactory<MakeGameProps, Game> & {
	buildDto: (props?: Partial<MakeGameProps>) => PlayniteProjectionResponseDto;
	buildDtoList: (n: number, props?: Partial<MakeGameProps>) => PlayniteProjectionResponseDto[];
};

export const makeGameFactory = ({
	completionStatusOptions,
	companyOptions,
	genreOptions,
	platformOptions,
	gameFactory,
	gameMapper,
}: GameFactoryDeps): GameFactory => {
	const propOrDefault = <T, V>(prop: T | undefined, value: V) => {
		if (prop === undefined) return value;
		return prop;
	};

	const build = (props: Partial<MakeGameProps> = {}): Game => {
		const completionStatusId = propOrDefault(
			props.playniteSnapshot?.completionStatusId,
			faker.helpers.arrayElement(completionStatusOptions),
		);
		const developerIds = propOrDefault(
			props.developerIds,
			faker.helpers.arrayElements(companyOptions, { min: 1, max: 3 }),
		);
		const publisherIds = propOrDefault(
			props.publisherIds,
			faker.helpers.arrayElements(companyOptions, { min: 1, max: 3 }),
		);
		const genreIds = propOrDefault(
			props.genreIds,
			faker.helpers.arrayElements(genreOptions, { min: 1, max: 15 }),
		);
		const platformIds = propOrDefault(
			props.platformIds,
			faker.helpers.arrayElements(platformOptions, { min: 1, max: 5 }),
		);

		return gameFactory.create({
			id: GameIdParser.fromExternal(props.id ?? faker.string.uuid()),
			playniteSnapshot: {
				id: PlayniteGameIdParser.fromExternal(props.playniteSnapshot?.id ?? faker.string.uuid()),
				name: propOrDefault(props.playniteSnapshot?.name, faker.commerce.productName()),
				description: propOrDefault(props.playniteSnapshot?.description, faker.lorem.sentence()),
				releaseDate: propOrDefault(props.playniteSnapshot?.releaseDate, faker.date.past()),
				playtime: propOrDefault(
					props.playniteSnapshot?.playtime,
					faker.number.int({ min: 0, max: 500 }),
				),
				lastActivity: propOrDefault(props.playniteSnapshot?.lastActivity, faker.date.recent()),
				added: propOrDefault(props.playniteSnapshot?.added, faker.date.past()),
				installDirectory: propOrDefault(
					props.playniteSnapshot?.installDirectory,
					faker.system.directoryPath(),
				),
				isInstalled: propOrDefault(props.playniteSnapshot?.isInstalled, faker.datatype.boolean()),
				backgroundImage: propOrDefault(props.playniteSnapshot?.backgroundImage, faker.image.url()),
				coverImage: propOrDefault(props.playniteSnapshot?.coverImage, faker.image.url()),
				icon: propOrDefault(props.playniteSnapshot?.icon, faker.image.url()),
				hidden: propOrDefault(props.playniteSnapshot?.hidden, faker.datatype.boolean()),
				completionStatusId,
			},
			contentHash: propOrDefault(props.contentHash, faker.string.hexadecimal({ length: 32 })),
			developerIds,
			genreIds,
			platformIds,
			publisherIds,
			lastUpdatedAt: propOrDefault(props.lastUpdatedAt, faker.date.recent()),
		});
	};

	const buildList = (n: number, props: Partial<MakeGameProps> = {}): Game[] => {
		return Array.from({ length: n }, () => build(props));
	};

	const buildDto: GameFactory["buildDto"] = (props) => {
		return gameMapper.toDto(build(props));
	};

	const buildDtoList: GameFactory["buildDtoList"] = (n, props) => {
		return Array.from({ length: n }, () => gameMapper.toDto(build(props)));
	};

	return Object.freeze({
		build,
		buildList,
		buildDto,
		buildDtoList,
	});
};
