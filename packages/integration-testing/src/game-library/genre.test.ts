import { faker } from "@faker-js/faker";
import type { SyncCursor } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { api, factory, root } from "../vitest.global.setup";

const isCursorAfter = (a: SyncCursor, b: SyncCursor): boolean => {
	if (a.lastUpdatedAt.getTime() !== b.lastUpdatedAt.getTime()) {
		return a.lastUpdatedAt > b.lastUpdatedAt;
	}

	return a.id > b.id;
};

describe("Game Library / Genre", () => {
	it("persists a new genre", () => {
		// Arrange
		const genre = factory.getGenreFactory().build();
		root.seedGenre(genre);

		// Act
		const result = api.gameLibrary.queries.getGetAllGenresQueryHandler().execute();
		const genres = result.data;
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
		const genres = result.data;

		// Assert
		expect(genres.length).toBeGreaterThanOrEqual(newGenresCount);
	});

	it("returns new genres after cursor", () => {
		// Arrange
		root.clock.setCurrent(new Date("2026-01-01T00:00:00Z"));
		const genres = factory.getGenreFactory().buildList(500);
		root.seedGenre(genres);

		// Act
		const firstResult = api.gameLibrary.queries.getGetAllGenresQueryHandler().execute();
		const firstData = firstResult.data;

		root.clock.advance(1000);
		const newGenres = factory
			.getGenreFactory()
			.buildList(500, { name: `${faker.book.genre()} (New)` });
		root.seedGenre(newGenres);

		const secondResult = api.gameLibrary.queries
			.getGetAllGenresQueryHandler()
			.execute({ lastCursor: firstResult.nextCursor });
		const secondData = secondResult.data;

		// Assert
		expect(isCursorAfter(secondResult.nextCursor, firstResult.nextCursor)).toBe(true);
		const firstIds = new Set(firstData.map((g) => g.Id));
		expect(secondData.every((g) => !firstIds.has(g.Id))).toBe(true);

		expect(firstData).toHaveLength(500);

		expect(secondData).toHaveLength(500);
		expect(secondData.every((g) => g.Name.match(/(new)/i))).toBe(true);
	});
});
