import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import type { GameLibraryFilterAggregateQuery } from "../domain";
import { ClientTestFactory } from "./client-test-factory";

export type IGameLibraryFilterQueryFactoryPort =
	IClientEntityFactoryPort<GameLibraryFilterAggregateQuery> & {
		buildUniqueList: (n: number) => GameLibraryFilterAggregateQuery[];
	};

export class GameLibraryFilterQueryFactory
	extends ClientTestFactory
	implements IGameLibraryFilterQueryFactoryPort
{
	private buildFilterQuery = (): GameLibraryFilterAggregateQuery => {
		return {
			sort: { type: this.pickOne("name", "recentlyUpdated") },
			filter: {
				installed: this.pickOne(faker.datatype.boolean(), undefined),
				search: this.pickOne(faker.lorem.words({ min: 1, max: 3 }), undefined),
			},
		};
	};

	private buildUniqueQuery = (i: number): GameLibraryFilterAggregateQuery => ({
		sort: { type: this.pickOne("name", "recentlyUpdated") },
		filter: {
			installed: i % 2 === 0,
			search: `search-${i}`,
		},
	});

	build: IGameLibraryFilterQueryFactoryPort["build"] = () => {
		return this.buildFilterQuery();
	};

	buildList: IGameLibraryFilterQueryFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildFilterQuery());
	};

	buildUniqueList: IGameLibraryFilterQueryFactoryPort["buildUniqueList"] = (n) => {
		let i = 0;
		return Array.from({ length: n }, () => {
			const query = this.buildUniqueQuery(i);
			i++;
			return query;
		});
	};
}
