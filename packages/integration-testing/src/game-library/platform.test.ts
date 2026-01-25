import type { PlatformResponseDto } from "@playatlas/game-library/dtos";
import { describe, expect, it } from "vitest";
import { api, factory, root } from "../vitest.global.setup";

describe("Game Library / Platform", () => {
	it("persists a new platform", () => {
		// Arrange
		const platform = factory.getPlatformFactory().build();
		root.seedPlatform(platform);

		// Act
		const result = api.gameLibrary.queries.getGetAllPlatformsQueryHandler().execute();
		const platforms = result.type === "ok" ? result.data : [];
		const addedPlatform = platforms.find((p) => p.Id === platform.getId());

		// Assert
		expect(addedPlatform).not.toBe(null);
		expect(addedPlatform).toMatchObject({
			Id: platform.getId(),
			Name: platform.getName(),
			SpecificationId: platform.getSpecificationId(),
			Background: platform.getBackground(),
			Cover: platform.getCover(),
			Icon: platform.getIcon(),
		} satisfies PlatformResponseDto);
	});

	it("handles a big list of platforms", () => {
		// Arrange
		const newPlatformsCount = 3000;
		const newPlatforms = factory.getPlatformFactory().buildList(newPlatformsCount);
		root.seedPlatform(newPlatforms);

		// Act
		const result = api.gameLibrary.queries.getGetAllPlatformsQueryHandler().execute();
		const platforms = result.type === "ok" ? result.data : [];

		// Assert
		expect(platforms.length).toBeGreaterThanOrEqual(newPlatformsCount);
	});

	it("query returns 'not_modified' when provided a matching etag", () => {
		// Arrange
		const platforms = factory.getPlatformFactory().buildList(500);
		root.seedPlatform(platforms);

		// Act
		const firstResult = api.gameLibrary.queries.getGetAllPlatformsQueryHandler().execute();
		const firstEtag = firstResult.type === "ok" ? firstResult.etag : null;

		const secondResult = api.gameLibrary.queries
			.getGetAllPlatformsQueryHandler()
			.execute({ ifNoneMatch: firstEtag });

		// Assert
		expect(secondResult.type === "not_modified").toBeTruthy();
	});

	it("query does not return 'not_modified' when platform list changes after first call", () => {
		// Arrange
		const platforms = factory.getPlatformFactory().buildList(500);
		root.seedPlatform(platforms);

		// Act
		const firstResult = api.gameLibrary.queries.getGetAllPlatformsQueryHandler().execute();
		const firstEtag = firstResult.type === "ok" ? firstResult.etag : null;
		const firstData = firstResult.type === "ok" ? firstResult.data : [];

		const newPlatforms = factory.getPlatformFactory().buildList(500);
		root.seedPlatform(newPlatforms);

		const secondResult = api.gameLibrary.queries
			.getGetAllPlatformsQueryHandler()
			.execute({ ifNoneMatch: firstEtag });
		const secondEtag = secondResult.type === "ok" ? secondResult.etag : null;
		const secondData = secondResult.type === "ok" ? secondResult.data : [];

		// Assert
		expect(secondResult.type).not.toBe("not_modified");
		expect(secondData).toHaveLength(firstData.length + 500);
		expect(secondEtag).not.toBe(firstEtag);
	});
});
