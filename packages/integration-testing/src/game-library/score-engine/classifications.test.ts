import { DEFAULT_CLASSIFICATIONS } from "@playatlas/game-library/commands";
import { ClassificationIdParser } from "@playatlas/game-library/domain";
import { describe, expect, it } from "vitest";
import { api, root } from "../../vitest.global.setup";

describe("Game Library / Score Engine Classifications", () => {
	it("creates default classifications", () => {
		// Act
		root.testApi.gameLibrary.commands
			.getApplyDefaultClassificationsCommandHandler()
			.execute({ type: "default" });
		const { classifications } = api.gameLibrary.queries
			.getGetAllClassificationsQueryHandler()
			.execute();
		const classificationIds = classifications.map((c) => c.getId());

		// Assert
		expect(classifications).toHaveLength(DEFAULT_CLASSIFICATIONS.length);
		expect(
			DEFAULT_CLASSIFICATIONS.every((c) =>
				classificationIds.includes(ClassificationIdParser.fromTrusted(c.id)),
			),
		).toBe(true);
	});

	it("command handler is idempotent", () => {
		// Act
		const handler =
			root.testApi.gameLibrary.commands.getApplyDefaultClassificationsCommandHandler();

		handler.execute({ type: "default" });
		handler.execute({ type: "default" });
		handler.execute({ type: "default" });

		const { classifications } = api.gameLibrary.queries
			.getGetAllClassificationsQueryHandler()
			.execute();

		// Assert
		expect(classifications).toHaveLength(DEFAULT_CLASSIFICATIONS.length);
	});

	it("updates classifications on version change", () => {
		// Arrange
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

		const classificationsV2 = [...DEFAULT_CLASSIFICATIONS].map((c) => ({
			...c,
			version: v2,
		}));

		// Act
		handler.execute({
			type: "override",
			buildDefaultClassificationsOverride: ({ classificationFactory: f }) => {
				return classificationsV2.map((c) =>
					f.create({ ...c, id: ClassificationIdParser.fromTrusted(c.id) }),
				);
			},
		});

		const secondQueryResult = api.gameLibrary.queries
			.getGetAllClassificationsQueryHandler()
			.execute();

		// Assert
		expect(firstQueryResult.classifications).toHaveLength(secondQueryResult.classifications.length);

		for (const c of firstQueryResult.classifications) {
			expect(c.getVersion()).toBe(v1);
		}

		for (const c of secondQueryResult.classifications) {
			expect(c.getVersion()).toBe(v2);
		}
	});

	it("soft delete existing classifications if missing from default list", () => {
		// Arrange

		const handler =
			root.testApi.gameLibrary.commands.getApplyDefaultClassificationsCommandHandler();

		handler.execute({
			type: "default",
		});

		const firstQueryResult = api.gameLibrary.queries
			.getGetAllClassificationsQueryHandler()
			.execute();

		// Act
		handler.execute({
			type: "override",
			buildDefaultClassificationsOverride: () => [],
		});

		const secondQueryResult = api.gameLibrary.queries
			.getGetAllClassificationsQueryHandler()
			.execute();

		// Assert
		expect(firstQueryResult.classifications).toHaveLength(DEFAULT_CLASSIFICATIONS.length);
		expect(secondQueryResult.classifications).toHaveLength(DEFAULT_CLASSIFICATIONS.length);

		for (const classification of secondQueryResult.classifications) {
			expect(classification.isDeleted()).toBe(true);
		}
	});

	it("restores soft-deleted classifications if they reappear", () => {
		// Arrange
		const handler =
			root.testApi.gameLibrary.commands.getApplyDefaultClassificationsCommandHandler();

		handler.execute({ type: "default" });

		handler.execute({
			type: "override",
			buildDefaultClassificationsOverride: () => [],
		});

		// Act
		handler.execute({ type: "default" });

		const result = api.gameLibrary.queries.getGetAllClassificationsQueryHandler().execute();

		// Assert
		expect(result.classifications).toHaveLength(DEFAULT_CLASSIFICATIONS.length);

		for (const classification of result.classifications) {
			expect(classification.isDeleted()).toBe(false);
		}
	});
});
