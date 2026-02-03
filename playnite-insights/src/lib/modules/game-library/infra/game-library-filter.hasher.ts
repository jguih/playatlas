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

	/**
	 * Canonical hash format (v1):
	 *
	 * [QueryVersion]\0
	 * [sort]\0
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

		appendNumber(queryVersion);
		appendString(query.Sort);

		if (query.Filter) {
			appendBool(query.Filter.installed ?? null);
			appendString(query.Filter.search?.trim().toLocaleLowerCase("en-US") ?? null);
		} else {
			appendString(null);
			appendString(null);
		}

		return hash.digest("base64");
	};
}
