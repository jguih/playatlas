import { DEFAULT_CLASSIFICATIONS } from "@playatlas/game-library/commands";
import { ClassificationIdParser } from "@playatlas/game-library/domain";
import { describe, expect, it } from "vitest";
import { isCursorAfter, isCursorEqual } from "../../test.lib";
import { api, root } from "../../vitest.global.setup";

describe("Game Library Synchronization / Classifications", () => {
	it("Sync cursor invariant: correctly returns updated items across distinct timestamps", async () => {
		// Arrange
		root.clock.setCurrent(new Date("2026-01-01T00:00:00Z"));

		const v1 = "v1.0.0";
		const v2 = "v2.0.0";

		const handler =
			root.testApi.gameLibrary.commands.getApplyDefaultClassificationsCommandHandler();

		const classificationsV1 = [...DEFAULT_CLASSIFICATIONS].map((c) => ({
			...c,
			version: v1,
		}));

		handler.execute({
			type: "override",
			buildDefaultClassificationsOverride: ({ classificationFactory: f }) => {
				return classificationsV1.map((c) =>
					f.create({ ...c, id: ClassificationIdParser.fromTrusted(c.id) }),
				);
			},
		});
		const firstQueryResult = api.gameLibrary.queries
			.getGetAllClassificationsQueryHandler()
			.execute();
		const firstIds = firstQueryResult.data.map((c) => c.Id);

		root.clock.advance(1000);

		const classificationsV2 = [...DEFAULT_CLASSIFICATIONS].map((c) => ({
			...c,
			version: v2,
		}));
		handler.execute({
			type: "override",
			buildDefaultClassificationsOverride: ({ classificationFactory: f }) => {
				return classificationsV2.map((c) =>
					f.create({ ...c, id: ClassificationIdParser.fromTrusted(c.id) }),
				);
			},
		});

		// Act
		const secondQueryResult = api.gameLibrary.queries
			.getGetAllClassificationsQueryHandler()
			.execute();

		// Assert
		expect(
			isCursorAfter(secondQueryResult.nextCursor, firstQueryResult.nextCursor),
			"Sync cursor must be strictly monotonic; Changes to repository's 'ORDER BY' clause may break incremental sync. All items must be ordered by LastUpdatedAt ASC, then Id ASC.",
		).toBe(true);
		expect(
			secondQueryResult.data.every((c) => firstIds.includes(c.Id)),
			"Query must return updated versions of previously-synced items",
		).toBe(true);

		expect(secondQueryResult.data).toHaveLength(classificationsV2.length);
		expect(secondQueryResult.data.every((c) => c.Version === v2)).toBe(true);
	});

	it("Sync cursor invariant: query returns an empty list when no data have changed", () => {
		// Arrange
		root.testApi.gameLibrary.commands.getApplyDefaultClassificationsCommandHandler().execute({
			type: "default",
		});
		const firstQueryResult = api.gameLibrary.queries
			.getGetAllClassificationsQueryHandler()
			.execute();

		// Act
		const secondQueryResult = api.gameLibrary.queries
			.getGetAllClassificationsQueryHandler()
			.execute({ lastCursor: firstQueryResult.nextCursor });

		// Assert
		expect(
			isCursorEqual(secondQueryResult.nextCursor, firstQueryResult.nextCursor),
			"Sync cursor must be strictly monotonic; Changes to repository's 'ORDER BY' clause may break incremental sync. All items must be ordered by LastUpdatedAt ASC, then Id ASC.",
		).toBe(true);

		expect(
			secondQueryResult.data,
			"Query must return an empty list if no items changed after last cursor",
		).toHaveLength(0);
	});
});
