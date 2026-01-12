import { api, factory, root } from "../../vitest.setup";

describe("Get All Genres Query Handler", () => {
  it("returns genres array", () => {
    // Arrange
    // Act
    const queryResult = api.gameLibrary.queries
      .getGetAllGenresQueryHandler()
      .execute();
    // Assert
    if (queryResult.type !== "ok") throw new Error("Invalid query result type");
    expect(queryResult.data.length).toBeGreaterThanOrEqual(1);
  });

  it("return 'not_modified' when provided a matching etag", () => {
    // Arrange
    // Act
    const firstResult = api.gameLibrary.queries
      .getGetAllGenresQueryHandler()
      .execute();
    if (firstResult.type !== "ok") throw new Error("Invalid result");
    const secondResult = api.gameLibrary.queries
      .getGetAllGenresQueryHandler()
      .execute({ ifNoneMatch: firstResult.etag });
    // Assert
    expect(secondResult.type === "not_modified").toBeTruthy();
  });

  it("does not return 'not_modified' when genre list changes after first call", () => {
    // Arrange
    const newGenre = factory.getGenreFactory().build();
    // Act
    const firstResult = api.gameLibrary.queries
      .getGetAllGenresQueryHandler()
      .execute();
    if (firstResult.type !== "ok") throw new Error("Invalid result");
    root.seedGenre(newGenre);
    const secondResult = api.gameLibrary.queries
      .getGetAllGenresQueryHandler()
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
