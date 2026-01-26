import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";
import { api, factory, root } from "../vitest.global.setup";

describe("Game Library / Completion Status", () => {
	it("update games and returns only those updated after a certain date", async () => {
		// Arrange
		root.clock.setCurrent(new Date("2026-01-01T00:00:00Z"));

		const completionStatuses = factory.getCompletionStatusFactory().buildList(50);
		root.seedCompletionStatus(completionStatuses);

		const since = root.clock.now();
		root.clock.advance(1000);

		const itemsToUpdate = faker.helpers.arrayElements(completionStatuses, 20);
		itemsToUpdate.forEach((i) => i.updateFromPlaynite({ name: `${i.getName()} (Updated)` }));
		root.seedCompletionStatus(itemsToUpdate);

		// Act
		const queryResult = api.gameLibrary.queries
			.getGetAllCompletionStatusesQueryHandler()
			.execute({ since });
		const queryCompletionStatuses = queryResult.data;

		// Assert
		expect(queryCompletionStatuses).toHaveLength(20);
		expect(queryCompletionStatuses.every((g) => g.Name?.match(/(updated)/i))).toBe(true);
	});
});
