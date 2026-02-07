import { classificationIds } from "@playatlas/common/domain";
import {
	makeSyncGamesCommand,
	type SyncGamesRequestDto,
	type SyncGamesRequestDtoItem,
} from "@playatlas/playnite-integration/commands";
import { beforeEach, describe, expect, it } from "vitest";
import { api, factory, root } from "../../vitest.global.setup";

describe("Game Library / Score Engine Game Classifications", () => {
	const syncGamesAsync = async (props: { items?: SyncGamesRequestDtoItem[] } = {}) => {
		const { items } = props;
		const sampleSize = items ? items.length : 2000;
		const addedItems = items ? items : factory.getSyncGameRequestDtoFactory().buildList(sampleSize);

		const requestDto: SyncGamesRequestDto = {
			AddedItems: addedItems,
			RemovedItems: [],
			UpdatedItems: [],
		};

		const command = makeSyncGamesCommand(requestDto);

		const commandResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(command);
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();

		return { commandResult, queryResult };
	};

	beforeEach(() => {
		root.seedDefaultClassifications();
	});

	it("creates one classification per game per engine", async () => {
		// Arrange
		const { commandResult, queryResult: gamesQueryResult } = await syncGamesAsync();
		expect(commandResult.success).toBe(true);

		// Act
		const queryResult = api.gameLibrary.scoreEngine.queries
			.getGetAllGameClassificationsQueryHandler()
			.execute();
		const expectedSize = gamesQueryResult.data.length * classificationIds.length;

		// Assert
		expect(queryResult.data).toHaveLength(expectedSize);
	});

	it("is idempotent when nothing changes", async () => {
		const syncItems = factory.getSyncGameRequestDtoFactory().buildList(2000);
		await syncGamesAsync({ items: syncItems });

		const firstQueryResult = api.gameLibrary.scoreEngine.queries
			.getGetAllGameClassificationsQueryHandler()
			.execute();

		await syncGamesAsync({ items: syncItems });

		const secondQueryResult = api.gameLibrary.scoreEngine.queries
			.getGetAllGameClassificationsQueryHandler()
			.execute();

		expect(firstQueryResult.data.length).toBe(secondQueryResult.data.length);
		expect(firstQueryResult).toEqual(secondQueryResult);
	});
});
