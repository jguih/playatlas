import { createHash, Hash } from "crypto";
import type { GameLibraryFilter } from "../domain/game-library-filter";

export type IGameLibraryFilterHasherPort = {
	computeHash: (props: {
		query: GameLibraryFilter["Query"];
		queryVersion: GameLibraryFilter["QueryVersion"];
	}) => string;
};

export class GameLibraryFilterHasher implements IGameLibraryFilterHasherPort {
	private readonly SEP = Buffer.from([0]);

	private appendStringToHash = (hash: Hash, value: string | null) => {
		hash.update(Buffer.from(value ?? "", "utf-8"));
		hash.update(this.SEP);
	};

	private appendBoolToHash = (hash: Hash, value: boolean | null) => {
		this.appendStringToHash(hash, value === null ? null : value ? "1" : "0");
	};

	private appendNumberToHash = (hash: Hash, value: number | null) => {
		this.appendStringToHash(hash, value === null ? null : value.toString());
	};

	private appendIDBKeyToHash = (hash: Hash, key: IDBValidKey) => {
		if (typeof key === "number") {
			this.appendStringToHash(hash, "n");
			this.appendNumberToHash(hash, key);
			return;
		}

		if (typeof key === "string") {
			this.appendStringToHash(hash, "s");
			this.appendStringToHash(hash, key);
			return;
		}

		if (key instanceof Date) {
			this.appendStringToHash(hash, "d");
			this.appendNumberToHash(hash, key.getTime());
			return;
		}

		throw new Error("Unsupported IDBValidKey type");
	};

	/**
	 * Cursor encoding:
	 * - null
	 * - S <type><value>
	 * - A <type><value>... E
	 */
	private appendCursorToHash = (hash: Hash, cursor?: IDBValidKey | null) => {
		if (cursor === null || cursor === undefined) {
			this.appendStringToHash(hash, null);
			return;
		}

		if (Array.isArray(cursor)) {
			// Array marker
			this.appendStringToHash(hash, "A");

			for (const key of cursor) {
				this.appendIDBKeyToHash(hash, key);
			}

			// End-of-array marker
			this.appendStringToHash(hash, "E");
			return;
		}

		// Scalar marker
		this.appendStringToHash(hash, "S");
		this.appendIDBKeyToHash(hash, cursor);
	};

	/**
	 * Canonical hash format (v1):
	 *
	 * [QueryVersion]\0
	 * [sort]\0
	 * [limit]\0
	 * [cursor]\0
	 * [installed]\0
	 * [search(lowercased, trimmed)]\0
	 *
	 * Notes:
	 * - search is case-insensitive
	 * - absence is encoded as empty string
	 */
	computeHash: IGameLibraryFilterHasherPort["computeHash"] = ({ query, queryVersion }) => {
		const hash = createHash("sha256");

		const appendString = (value: string | null) => this.appendStringToHash(hash, value);
		const appendBool = (value: boolean | null) => this.appendBoolToHash(hash, value);
		const appendNumber = (value: number | null) => this.appendNumberToHash(hash, value);
		const appendCursor = (value?: IDBValidKey | null) => this.appendCursorToHash(hash, value);

		appendNumber(queryVersion);

		appendString(query.sort);
		appendNumber(query.limit);

		appendCursor(query.cursor);

		if (query.filter) {
			appendBool(query.filter.installed ?? null);
			appendString(query.filter.search?.trim().toLocaleLowerCase("en-US") ?? null);
		} else {
			appendString(null);
			appendString(null);
		}

		return hash.digest("base64");
	};
}
