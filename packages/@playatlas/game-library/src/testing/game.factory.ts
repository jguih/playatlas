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
import { monotonicFactory } from "ulid";
import type { IGameFactoryPort, IGameMapperPort } from "../application";
import { type Game } from "../domain/game.entity";
import { type MakeGameProps, type PlayniteGameSnapshot } from "../domain/game.entity.types";
import type { PlayniteProjectionResponseDto } from "../dtos";

export type GameFactoryDeps = {
	completionStatusOptions: CompletionStatusId[];
	companyOptions: CompanyId[];
	genreOptions: GenreId[];
	platformOptions: PlatformId[];
	gameFactory: IGameFactoryPort;
	gameMapper: IGameMapperPort;
};

export type TestGameFactory = TestEntityFactory<MakeGameProps, Game> & {
	buildDto: (props?: Partial<MakeGameProps>) => PlayniteProjectionResponseDto;
	buildDtoList: (n: number, props?: Partial<MakeGameProps>) => PlayniteProjectionResponseDto[];
	buildPlayniteSnapshot: (
		override?: Partial<MakeGameProps["playniteSnapshot"]>,
	) => PlayniteGameSnapshot;
};

export const makeTestGameFactory = ({
	completionStatusOptions,
	companyOptions,
	genreOptions,
	platformOptions,
	gameFactory,
	gameMapper,
}: GameFactoryDeps): TestGameFactory => {
	const pickMany = <T>(options: readonly T[], { min, max }: { min: number; max: number }) =>
		faker.helpers.arrayElements(options, { min, max });

	const buildPlayniteSnapshot: TestGameFactory["buildPlayniteSnapshot"] = (override = {}) => {
		const completionStatusId =
			override?.completionStatusId ?? faker.helpers.arrayElement(completionStatusOptions);

		return {
			id: PlayniteGameIdParser.fromExternal(override?.id ?? faker.string.uuid()),
			name: override?.name ?? faker.commerce.productName(),
			description: override?.description ?? faker.lorem.sentence(),
			releaseDate: override?.releaseDate ?? faker.date.past(),
			playtime: override?.playtime ?? faker.number.int({ min: 0, max: 500 }),
			lastActivity: override?.lastActivity ?? faker.date.recent(),
			added: override?.added ?? faker.date.past(),
			installDirectory: override?.installDirectory ?? faker.system.directoryPath(),
			isInstalled: override?.isInstalled ?? faker.datatype.boolean(),
			backgroundImage: override?.backgroundImage ?? faker.image.url(),
			coverImage: override?.coverImage ?? faker.image.url(),
			icon: override?.icon ?? faker.image.url(),
			hidden: override?.hidden ?? faker.datatype.boolean(),
			completionStatusId,
		};
	};

	const createBuilder = (ulid = monotonicFactory()) => ({
		build: (props: Partial<MakeGameProps> = {}) =>
			gameFactory.create({
				id: GameIdParser.fromExternal(props.id ?? ulid()),
				playniteSnapshot: buildPlayniteSnapshot(props.playniteSnapshot),
				contentHash: props.contentHash ?? faker.string.hexadecimal({ length: 32 }),
				developerIds: props.developerIds ?? pickMany(companyOptions, { min: 1, max: 3 }),
				publisherIds: props.publisherIds ?? pickMany(companyOptions, { min: 1, max: 3 }),
				genreIds: props.genreIds ?? pickMany(genreOptions, { min: 1, max: 15 }),
				platformIds: props.platformIds ?? pickMany(platformOptions, { min: 1, max: 5 }),
			}),
	});

	const build = (props?: Partial<MakeGameProps>) => createBuilder().build(props);

	const buildList = (n: number, props?: Partial<MakeGameProps>) => {
		const builder = createBuilder();
		return Array.from({ length: n }, () => builder.build(props));
	};

	const buildDto = (props?: Partial<MakeGameProps>) =>
		gameMapper.toDto(createBuilder().build(props));

	const buildDtoList = (n: number, props?: Partial<MakeGameProps>) => {
		const builder = createBuilder();
		return Array.from({ length: n }, () => gameMapper.toDto(builder.build(props)));
	};

	return Object.freeze({
		build,
		buildPlayniteSnapshot,
		buildList,
		buildDto,
		buildDtoList,
	});
};
