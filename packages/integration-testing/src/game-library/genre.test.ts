import { api, factory, root } from "../vitest.global.setup";

describe("Game Library / Genre", () => {
  it("persists a new genre", () => {
    // Arrange
    const genre = factory.getGenreFactory().build();
    root.seedGenre(genre);

    // Act
    const result = api.gameLibrary.queries
      .getGetAllGenresQueryHandler()
      .execute();
    const genres = result.type === "ok" ? result.data : [];
    const addedGenre = genres.find((g) => g.Id === genre.getId());
    // Assert
    expect(addedGenre).toBeTruthy();
    expect(addedGenre).toMatchObject({
      Id: genre.getId(),
      Name: genre.getName(),
    });
  });

  it("returns a big list of genres", () => {
    // Arrange
    const newGenresCount = 3000;
    const newGenres = factory.getGenreFactory().buildList(newGenresCount);
    root.seedGenre(newGenres);

    // Act
    const result = api.gameLibrary.queries
      .getGetAllGenresQueryHandler()
      .execute();
    const genres = result.type === "ok" ? result.data : [];

    // Assert
    expect(genres.length).toBeGreaterThanOrEqual(newGenresCount);
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
