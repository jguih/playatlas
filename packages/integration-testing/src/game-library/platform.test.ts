import type { PlatformResponseDto } from "@playatlas/game-library/dtos";
import { api, factory, root } from "../vitest.global.setup";

describe("Game Library / Platform", () => {
  it("persists a new platform", () => {
    // Arrange
    const platform = factory.getPlatformFactory().build();
    root.seedPlatform(platform);

    // Act
    const result = api.gameLibrary.queries
      .getGetAllPlatformsQueryHandler()
      .execute();
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
    const newPlatforms = factory
      .getPlatformFactory()
      .buildList(newPlatformsCount);
    root.seedPlatform(newPlatforms);

    // Act
    const result = api.gameLibrary.queries
      .getGetAllPlatformsQueryHandler()
      .execute();
    const platforms = result.type === "ok" ? result.data : [];

    // Assert
    expect(platforms.length).toBeGreaterThanOrEqual(newPlatformsCount);
  });

  it("query returns null values as 'null' and not empty string", () => {
    // Arrange
    const onePlatform = factory
      .getPlatformFactory()
      .build({ background: null, cover: null, icon: null });
    root.seedPlatform(onePlatform);
    // Act
    const result = api.gameLibrary.queries
      .getGetAllPlatformsQueryHandler()
      .execute();
    if (result.type !== "ok") throw new Error("Result type must be 'ok'");
    // Assert
    expect(onePlatform.getBackground()).toBe(null);
    expect(onePlatform.getCover()).toBe(null);
    expect(onePlatform.getIcon()).toBe(null);
  });

  it("query returns 'not_modified' when provided a matching etag", () => {
    // Arrange
    // Act
    const firstResult = api.gameLibrary.queries
      .getGetAllPlatformsQueryHandler()
      .execute();
    if (firstResult.type !== "ok") throw new Error("Result type must be 'ok'");
    const secondResult = api.gameLibrary.queries
      .getGetAllPlatformsQueryHandler()
      .execute({ ifNoneMatch: firstResult.etag });
    // Assert
    expect(secondResult.type === "not_modified").toBeTruthy();
  });

  it("query does not return 'not_modified' when platform list changes after first call", () => {
    // Arrange
    const newPlatform = factory.getPlatformFactory().build();
    // Act
    const firstResult = api.gameLibrary.queries
      .getGetAllPlatformsQueryHandler()
      .execute();
    if (firstResult.type !== "ok") throw new Error("Result type must be 'ok'");
    root.seedPlatform(newPlatform);
    const secondResult = api.gameLibrary.queries
      .getGetAllPlatformsQueryHandler()
      .execute({ ifNoneMatch: firstResult.etag });
    // Assert
    expect(secondResult.type === "not_modified").toBeFalsy();
    expect(
      secondResult.type === "ok" &&
        secondResult.data.length === firstResult.data.length + 1
    ).toBeTruthy();
    expect(
      secondResult.type === "ok" && secondResult.etag !== firstResult.etag
    ).toBeTruthy();
  });
});
