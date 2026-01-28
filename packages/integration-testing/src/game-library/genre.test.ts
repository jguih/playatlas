import { faker } from "@faker-js/faker";
import type { GenreResponseDto } from "@playatlas/game-library/dtos";
import { describe, expect, it } from "vitest";
import { isCursorAfter } from "../test.lib";
import { api, factory, root } from "../vitest.global.setup";

const isOrderedByUpdatedAtAndIdAsc = (items: GenreResponseDto[]) =>
	items.every((current, index, array) => {
		if (index === 0) return true;

		const prev = array[index - 1];

		const prevUpdatedAt = new Date(prev.Sync.LastUpdatedAt).getTime();
		const currUpdatedAt = new Date(current.Sync.LastUpdatedAt).getTime();

		return (
			prevUpdatedAt < currUpdatedAt || (prevUpdatedAt === currUpdatedAt && prev.Id < current.Id)
		);
	});

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

	it("ENFORCES sync cursor invariant: ORDER BY LastUpdatedAt ASC, Id ASC", () => {
		// Arrange
		root.clock.setCurrent(new Date("2026-01-01T00:00:00Z"));
		const genres = factory.getGenreFactory().buildList(500);
		root.seedGenre(genres);

		// Act
		const firstResult = api.gameLibrary.queries.getGetAllGenresQueryHandler().execute();
		const firstData = firstResult.data;
		const firstIds = new Set(firstData.map((g) => g.Id));

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
		expect(
			isCursorAfter(secondResult.nextCursor, firstResult.nextCursor),
			"Sync cursor must be strictly monotonic; ORDER BY change will break incremental sync",
		).toBe(true);
		expect(
			secondData.every((g) => !firstIds.has(g.Id)),
			"Item order for synchronization violated: all items must be ordered by LastUpdatedAt ASC, then Id ASC",
		).toBe(true);

		expect(firstData).toHaveLength(500);

		expect(secondData).toHaveLength(500);
		expect(secondData.every((g) => g.Name.match(/(new)/i))).toBe(true);
	});

	it("ENFORCES sync invariant: items must be ordered by LastUpdatedAt ASC, then Id ASC", () => {
		// Arrange
		const genres = factory.getGenreFactory().buildList(500);
		root.seedGenre(genres);

		// Act
		const result = api.gameLibrary.queries.getGetAllGenresQueryHandler().execute();

		// Assert
		expect(result.data).toHaveLength(500);
		expect(
			isOrderedByUpdatedAtAndIdAsc(result.data),
			"Sync cursor invariant violated: results MUST be ordered by LastUpdatedAt ASC, then Id ASC",
		).toBe(true);
	});
});
