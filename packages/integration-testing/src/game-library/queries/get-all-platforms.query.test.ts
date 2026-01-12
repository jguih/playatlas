import { api, factory, root } from "../../vitest.setup";

describe("Get All Platforms Query Handler", () => {
  it("returns an array of platforms", () => {
    // Arrange
    // Act
    const result = api.gameLibrary.queries
      .getGetAllPlatformsQueryHandler()
      .execute();
    // Assert
    if (result.type !== "ok") throw new Error("Result type must be 'ok'");
    expect(result.data.length).toBeGreaterThan(1);
  });

  it("returns null values as 'null' and not empty string", () => {
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
    const oneResult = result.data.find((p) => p.Id === onePlatform.getId());
    // Assert
    expect(onePlatform.getBackground()).toBe(null);
    expect(onePlatform.getCover()).toBe(null);
    expect(onePlatform.getIcon()).toBe(null);
  });

  it("return 'not_modified' when provided a matching etag", () => {
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

  it("does not return 'not_modified' when platform list changes after first call", () => {
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
