import { describe, expect, it } from "vitest";
import { api, factory, root } from "../vitest.global.setup";

describe("Game Library / Genre", () => {
	it("persists a new genre", () => {
		// Arrange
		const genre = factory.getGenreFactory().build();
		root.seedGenre(genre);

		// Act
		const result = api.gameLibrary.queries.getGetAllGenresQueryHandler().execute();
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
		const result = api.gameLibrary.queries.getGetAllGenresQueryHandler().execute();
		const genres = result.type === "ok" ? result.data : [];

		// Assert
		expect(genres.length).toBeGreaterThanOrEqual(newGenresCount);
	});

	it("return 'not_modified' when provided a matching etag", () => {
		// Arrange
		const genres = factory.getGenreFactory().buildList(500);
		root.seedGenre(genres);

		// Act
		const firstResult = api.gameLibrary.queries.getGetAllGenresQueryHandler().execute();
		const firstEtag = firstResult.type === "ok" ? firstResult.etag : null;

		const secondResult = api.gameLibrary.queries
			.getGetAllGenresQueryHandler()
			.execute({ ifNoneMatch: firstEtag });

		// Assert
		expect(secondResult.type === "not_modified").toBeTruthy();
	});

	it("does not return 'not_modified' when genre list changes after first call", () => {
		// Arrange
		const genres = factory.getGenreFactory().buildList(500);
		root.seedGenre(genres);

		// Act
		const firstResult = api.gameLibrary.queries.getGetAllGenresQueryHandler().execute();
		const firstEtag = firstResult.type === "ok" ? firstResult.etag : null;
		const firstData = firstResult.type === "ok" ? firstResult.data : [];

		const newGenres = factory.getGenreFactory().buildList(500);
		root.seedGenre(newGenres);

		const secondResult = api.gameLibrary.queries
			.getGetAllGenresQueryHandler()
			.execute({ ifNoneMatch: firstEtag });
		const secondEtag = secondResult.type === "ok" ? secondResult.etag : null;
		const secondData = secondResult.type === "ok" ? secondResult.data : [];

		// Assert
		expect(secondResult.type).not.toBe("not_modified");
		expect(secondData).toHaveLength(firstData.length + 500);
		expect(secondEtag).not.toBe(firstEtag);
	});
});
