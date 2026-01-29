import { faker } from "@faker-js/faker";
import { PlayniteCompletionStatusIdParser } from "@playatlas/common/domain";
import { describe, expect, it } from "vitest";
import { api, factory, root } from "../../vitest.global.setup";

describe("Game Library Synchronization / Completion Status", () => {
	it("Sync cursor invariant: correctly returns updated items across distinct timestamps", async () => {
		// Arrange
		root.clock.setCurrent(new Date("2026-01-01T00:00:00Z"));

		const completionStatuses = factory.getCompletionStatusFactory().buildList(50);
		root.seedCompletionStatus(completionStatuses);
		const firstQueryResult = api.gameLibrary.queries
			.getGetAllCompletionStatusesQueryHandler()
			.execute();

		root.clock.advance(1000);

		const itemsToUpdate = faker.helpers.arrayElements(completionStatuses, 20);
		itemsToUpdate.forEach((i) =>
			i.updateFromPlaynite({
				name: `${i.getName()} (Updated)`,
				playniteId: PlayniteCompletionStatusIdParser.fromTrusted(`${i.getPlayniteId()}-(updated)`),
			}),
		);
		root.seedCompletionStatus(itemsToUpdate);

		// Act
		const queryResult = api.gameLibrary.queries
			.getGetAllCompletionStatusesQueryHandler()
			.execute({ lastCursor: firstQueryResult.nextCursor });
		const queryCompletionStatuses = queryResult.data;

		// Assert
		expect(queryCompletionStatuses).toHaveLength(20);
		expect(queryCompletionStatuses.every((g) => g.Name?.match(/(updated)/i))).toBe(true);
	});
});
