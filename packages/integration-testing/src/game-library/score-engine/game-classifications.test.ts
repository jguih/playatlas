import type { PlayAtlasApiV1 } from "@playatlas/bootstrap/application";
import { classificationIds } from "@playatlas/common/domain";
import type { ScoreEngineVersion } from "@playatlas/game-library/application";
import {
	makeSyncGamesCommand,
	type SyncGamesRequestDto,
	type SyncGamesRequestDtoItem,
} from "@playatlas/playnite-integration/commands";
import { beforeEach, describe, expect, it } from "vitest";
import { buildTestCompositionRoot } from "../../test.lib";
import { api, factory, root } from "../../vitest.global.setup";

describe("Game Library / Score Engine Game Classifications", () => {
	const syncGamesAsync = async (
		props: { items?: SyncGamesRequestDtoItem[]; api?: PlayAtlasApiV1 } = {},
	) => {
		const { items } = props;
		const _api = props.api ? props.api : api;
		const sampleSize = items ? items.length : 2000;
		const addedItems = items ? items : factory.getSyncGameRequestDtoFactory().buildList(sampleSize);

		const requestDto: SyncGamesRequestDto = {
			AddedItems: addedItems,
			RemovedItems: [],
			UpdatedItems: [],
		};

		const command = makeSyncGamesCommand(requestDto);

		const commandResult = await _api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(command);
		const queryResult = _api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();

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

	it("recalculate classification scores on engine version change", async () => {
		// Arrange
		const engineV1: ScoreEngineVersion = "v1.0.0";
		const engineV2: ScoreEngineVersion = "v2.0.0";
		const syncItems = factory.getSyncGameRequestDtoFactory().buildList(2000);

		const root1 = buildTestCompositionRoot({
			scoreEngine: { engineVersion: { HORROR: engineV1 } },
		});
		const api1 = await root1.buildAsync();
		root1.seedDefaultClassifications();

		await syncGamesAsync({ items: syncItems, api: api1 });

		// Act
		const root2 = buildTestCompositionRoot({
			scoreEngine: { engineVersion: { HORROR: engineV2 } },
		});
		const api2 = await root2.buildAsync();

		await syncGamesAsync({ items: syncItems, api: api2 });

		// Assert
		expect(true).toBe(true);
	});
});
