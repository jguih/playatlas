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
		const platforms = result.data;
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
		} satisfies Partial<PlatformResponseDto>);
	});

	it("handles a big list of platforms", () => {
		// Arrange
		const newPlatformsCount = 3000;
		const newPlatforms = factory.getPlatformFactory().buildList(newPlatformsCount);
		root.seedPlatform(newPlatforms);

		// Act
		const result = api.gameLibrary.queries.getGetAllPlatformsQueryHandler().execute();
		const platforms = result.data;

		// Assert
		expect(platforms.length).toBeGreaterThanOrEqual(newPlatformsCount);
	});
});
