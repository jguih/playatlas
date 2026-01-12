import { faker } from "@faker-js/faker";
import { GameRelationship, type Game } from "@playatlas/game-library/domain";
import { api, factory, root } from "../vitest.setup";

const assertRelationshipLoad = (
  game: Game,
  relationshipKey: GameRelationship
) => {
  root.seedGames(game);

  const queryResult = api.gameLibrary.queries
    .getGetAllGamesQueryHandler()
    .execute();
  if (queryResult.type !== "ok") throw new Error("Invalid query result");

  const loaded = queryResult.data.find((g) => g.Id === game.getId());
  const originalIds = game.relationships[relationshipKey].isLoaded()
    ? game.relationships[relationshipKey].get()
    : [];
  const loadedIds = loaded?.relationships[relationshipKey].get();

  expect(loaded).toBeTruthy();
  expect(loaded?.getId()).toBe(game.getId());
  expect(loaded?.relationships[relationshipKey].isLoaded()).toBeTruthy();
  // Expect other relationships to not be loaded
  for (const key of Object.keys(game.relationships) as GameRelationship[]) {
    if (key !== relationshipKey) {
      expect(loaded?.relationships[key].isLoaded()).toBeFalsy();
    }
  }
  expect(loadedIds).toHaveLength(originalIds.length);
  expect(new Set(loadedIds)).toEqual(new Set(originalIds));
};

describe("Game Repository", () => {
  it("persists games", () => {
    // Arrange
    const games = factory.getGameFactory().buildList(100);
    const randomGame = faker.helpers.arrayElement(games);
    // Act
    root.seedGames(games);
    const queryResult = api.gameLibrary.queries
      .getGetAllGamesQueryHandler()
      .execute();
    // Assert
    if (queryResult.type !== "ok") throw new Error("Invalid query result");
    const added = queryResult.data;
    const addedRandomGame = added.find((g) => g.Id === randomGame.getId());
    expect(added).toHaveLength(games.length);
    expect(addedRandomGame?.Id).toBe(randomGame.getId());
    expect(addedRandomGame?.Name).toBe(randomGame.getName());
    expect(addedRandomGame?.CompletionStatusId).toBe(
      randomGame.getCompletionStatusId()
    );
  });

  it("persists a game and eager load its developers when requested", () => {
    assertRelationshipLoad(factory.getGameFactory().build(), "developers");
  });

  it("persists a game and eager load its publishers when requested", () => {
    assertRelationshipLoad(factory.getGameFactory().build(), "publishers");
  });

  it("persists a game and eager load its genres when requested", () => {
    assertRelationshipLoad(factory.getGameFactory().build(), "genres");
  });

  it("persists a game and eager load its platforms when requested", () => {
    assertRelationshipLoad(factory.getGameFactory().build(), "platforms");
  });

  it("returns game manifest data", () => {
    // Arrange
    const games = factory.getGameFactory().buildList(200);
    repository.upsert(games);
    // Act
    const manifestData = repository.getManifestData();
    const randomManifestGame = faker.helpers.arrayElement(manifestData);
    // Assert
    expect(manifestData.length).toBeGreaterThanOrEqual(games.length);
    expect(games.map((g) => g.getId())).toContain(randomManifestGame.Id);
  });

  it("returns all games with loaded relationships", () => {
    // Arrange
    const games = factory.getGameFactory().buildList(200);
    repository.upsert(games);
    // Act
    const allGames = repository.all({ load: true });
    // Assert
    expect(allGames.length).toBeGreaterThanOrEqual(games.length);
    for (const r of Object.keys(games[0].relationships) as GameRelationship[]) {
      expect(allGames.every((g) => g.relationships[r].isLoaded())).toBeTruthy();
    }
  });
});
