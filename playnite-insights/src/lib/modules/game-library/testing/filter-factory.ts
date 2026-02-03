import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import { GameLibraryFilterIdParser, type GameLibraryFilter } from "../domain";
import { ClientTestFactory } from "./client-test-factory";

export type IGameLibraryFilterFactoryPort = IClientEntityFactoryPort<GameLibraryFilter>;

export class GameLibraryFilterFactory
	extends ClientTestFactory
	implements IGameLibraryFilterFactoryPort
{
	private buildFilter = (): GameLibraryFilter => {
		const SourceUpdatedAt = faker.date.recent();

		return {
			Id: GameLibraryFilterIdParser.fromTrusted(faker.string.uuid()),
			Hash: faker.string.uuid(),
			LastUsedAt: faker.date.recent(),
			UseCount: faker.number.int({ min: 0, max: 200 }),
			SourceUpdatedAt,
			SourceUpdatedAtMs: SourceUpdatedAt.getTime(),
			Query: {
				limit: 50,
				sort: this.pickOne("name", "recent"),
				cursor: null,
				filter: {
					installed: this.pickOne(faker.datatype.boolean(), undefined),
					search: this.pickOne(faker.lorem.words({ min: 1, max: 3 }), undefined),
				},
			},
			QueryVersion: 1,
		};
	};

	build: IGameLibraryFilterFactoryPort["build"] = () => {
		return this.buildFilter();
	};

	buildList: IGameLibraryFilterFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildFilter());
	};
}
