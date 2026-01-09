import type { Game } from '../domain/game.entity';
import type { GameQuery, GameQueryResult } from './game.repository.types';

export interface IGameRepositoryPort {
	/**
	 * Add a game
	 * @returns The game key if created successfully
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	addAsync: (props: { game: Game }) => Promise<string | null>;
	/**
	 * Updates a game, will create it if missing
	 * @returns `true` on success, `false` otherwise
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	putAsync: (props: { game: Game }) => Promise<boolean>;
	/**
	 * Deletes a game
	 * @returns `true` on success, `false` otherwise
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	deleteAsync: (props: { gameId: Game['Id'] }) => Promise<boolean>;
	/**
	 * Finds and returns a game by its id
	 * @returns The game note or `null` when not found
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	getByIdAsync: (gameId: Game['Id']) => Promise<Game | null>;
	/**
	 * Sync provided list of games with local db, creating, updating
	 * or marking games as deleted
	 * @param props
	 * @returns An array of games
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	syncAsync: (games: Game[], opts?: { override?: boolean }) => Promise<void>;
	queryAsync(query: GameQuery): Promise<GameQueryResult>;
}
