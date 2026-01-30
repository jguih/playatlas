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
import type { GameResponseDto } from "../dtos";

export type GameFactoryDeps = {
	completionStatusOptions: CompletionStatusId[];
	companyOptions: CompanyId[];
	genreOptions: GenreId[];
	platformOptions: PlatformId[];
	gameFactory: IGameFactoryPort;
	gameMapper: IGameMapperPort;
};

export type TestGameFactory = TestEntityFactory<MakeGameProps, Game> & {
	buildDto: (props?: Partial<MakeGameProps>) => GameResponseDto;
	buildDtoList: (n: number, props?: Partial<MakeGameProps>) => GameResponseDto[];
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

	const pickOne = <T>(options: readonly T[]) => faker.helpers.arrayElement(options);

	const p = <T, V>(value: V, prop?: T) => {
		if (prop === undefined) return value;
		return prop;
	};

	const buildPlayniteSnapshot: TestGameFactory["buildPlayniteSnapshot"] = (override = {}) => {
		return {
			id: PlayniteGameIdParser.fromExternal(override?.id ?? faker.string.uuid()),
			name: p(faker.commerce.productName(), override?.name),
			description: p(faker.lorem.sentence(), override?.description),
			releaseDate: p(faker.date.past(), override?.releaseDate),
			playtime: p(faker.number.int({ min: 0, max: 50000 }), override?.playtime),
			lastActivity: p(faker.date.recent(), override?.lastActivity),
			added: p(faker.date.past(), override?.added),
			installDirectory: p(faker.system.directoryPath(), override?.installDirectory),
			isInstalled: p(faker.datatype.boolean(), override?.isInstalled),
			backgroundImagePath: p(faker.image.url(), override?.backgroundImagePath),
			coverImagePath: p(faker.image.url(), override?.coverImagePath),
			iconImagePath: p(faker.image.url(), override?.iconImagePath),
			hidden: p(faker.datatype.boolean(), override?.hidden),
			completionStatusId: p(pickOne(completionStatusOptions), override?.completionStatusId),
		};
	};

	const createBuilder = (ulid = monotonicFactory()) => ({
		build: (props: Partial<MakeGameProps> = {}) =>
			gameFactory.create({
				id: GameIdParser.fromExternal(props.id ?? ulid()),
				playniteSnapshot: buildPlayniteSnapshot(props.playniteSnapshot),
				contentHash: p(faker.string.hexadecimal({ length: 32 }), props.contentHash),
				developerIds: p(pickMany(companyOptions, { min: 1, max: 3 }), props.developerIds),
				publisherIds: p(pickMany(companyOptions, { min: 1, max: 3 }), props.publisherIds),
				genreIds: p(pickMany(genreOptions, { min: 1, max: 15 }), props.genreIds),
				platformIds: p(pickMany(platformOptions, { min: 1, max: 5 }), props.platformIds),
				completionStatusId: null,
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
