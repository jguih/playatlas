import { type ClientApi } from '$lib/modules/bootstrap/application';
import { TestCompositionRoot } from '$lib/modules/bootstrap/testing';
import { faker } from '@faker-js/faker';
import 'fake-indexeddb/auto';
import type { Genre } from '../game-library/domain';

describe('GameLibrary / Genres (integration)', () => {
	let root: TestCompositionRoot;
	let api: ClientApi;

	beforeEach(() => {
		root = new TestCompositionRoot();
		api = root.build();
		vi.resetAllMocks();
	});

	afterEach(async () => {
		await root.cleanup();
	});

	it('persists and retrieves big list of genres', async () => {
		// Arrange
		const genres = root.factories.genre.buildList(2000);
		const genreIds = genres.map((g) => g.Id);

		await api.GameLibrary.Command.SyncGenres.executeAsync({ genres });

		// Act
		const result = await api.GameLibrary.Query.GetGenresByIds.executeAsync({ genreIds });

		expect(result.genres).toHaveLength(2000);
		expect(result.genres.map((g) => g.Id)).toEqual(genreIds);
	});

	it('retrieves only the requested genres', async () => {
		// Arrange
		const genres = root.factories.genre.buildList(10);
		const requested = genres.slice(0, 3);
		const requestedIds = requested.map((g) => g.Id);

		await api.GameLibrary.Command.SyncGenres.executeAsync({ genres });

		// Act
		const result = await api.GameLibrary.Query.GetGenresByIds.executeAsync({
			genreIds: requestedIds,
		});

		// Assert
		expect(result.genres).toHaveLength(3);
		expect(result.genres.map((g) => g.Id)).toEqual(requestedIds);
	});

	it('ignores non-existing genre ids', async () => {
		// Arrange
		const genres = root.factories.genre.buildList(5);
		const existingIds = genres.map((g) => g.Id);
		const missingId = 'non-existing-genre-id';

		await api.GameLibrary.Command.SyncGenres.executeAsync({ genres });

		// Act
		const result = await api.GameLibrary.Query.GetGenresByIds.executeAsync({
			genreIds: [...existingIds, missingId],
		});

		// Assert
		expect(result.genres).toHaveLength(5);
		expect(result.genres.map((g) => g.Id)).toEqual(existingIds);
	});

	it.each([{ genreIds: ['genre-1', 'genre-2'] }, { genreIds: [] }])(
		'returns an empty list when no genres exist',
		async ({ genreIds }) => {
			// Act
			const result = await api.GameLibrary.Query.GetGenresByIds.executeAsync({
				genreIds,
			});

			// Assert
			expect(result.genres).toEqual([]);
		},
	);

	it('preserves the order of requested genre ids', async () => {
		// Arrange
		const genres = root.factories.genre.buildList(5);

		await api.GameLibrary.Command.SyncGenres.executeAsync({ genres });

		const requestedIds = [genres[3].Id, genres[0].Id, genres[4].Id];

		// Act
		const result = await api.GameLibrary.Query.GetGenresByIds.executeAsync({
			genreIds: requestedIds,
		});

		// Assert
		expect(result.genres.map((g) => g.Id)).toEqual(requestedIds);
	});

	it('updates existing genres when syncing again', async () => {
		// Arrange
		const genre = root.factories.genre.build();

		await api.GameLibrary.Command.SyncGenres.executeAsync({
			genres: genre,
		});

		const updatedGenre: Genre = {
			...genre,
			Name: `${genre.Name} (Updated)`,
			SourceUpdatedAt: faker.date.future(),
		};

		// Act
		await api.GameLibrary.Command.SyncGenres.executeAsync({
			genres: updatedGenre,
		});

		const result = await api.GameLibrary.Query.GetGenreById.executeAsync({
			genreId: genre.Id,
		});

		// Assert
		expect(result.genre).toBeTruthy();
		expect(result.genre!.Name).toBe(updatedGenre.Name);
	});

	it('does not update existing genres when syncing older genres', async () => {
		// Arrange
		const genres = root.factories.genre.buildList(20);
		const genreIds = genres.map((g) => g.Id);

		await api.GameLibrary.Command.SyncGenres.executeAsync({
			genres,
		});

		const updatedGenres: Genre[] = genres.map((g) => {
			return {
				...g,
				Name: `${g.Name} (Updated)`,
				SourceUpdatedAt: faker.date.past(),
			};
		});

		// Act
		await api.GameLibrary.Command.SyncGenres.executeAsync({
			genres: updatedGenres,
		});

		const result = await api.GameLibrary.Query.GetGenresByIds.executeAsync({
			genreIds,
		});

		// Assert
		expect(result.genres).toHaveLength(20);
		expect(result.genres.every((g) => !g.Name.includes('(Updated)'))).toBeTruthy();
	});

	it('handles syncing an empty genre list gracefully', async () => {
		// Arrange
		const genres = root.factories.genre.buildList(3);
		const genreIds = genres.map((g) => g.Id);

		await api.GameLibrary.Command.SyncGenres.executeAsync({ genres });

		// Act
		await api.GameLibrary.Command.SyncGenres.executeAsync({ genres: [] });

		const result = await api.GameLibrary.Query.GetGenresByIds.executeAsync({
			genreIds,
		});

		// Assert
		expect(result.genres).toHaveLength(3);
	});
});
