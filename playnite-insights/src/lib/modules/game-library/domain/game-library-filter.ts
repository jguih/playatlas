import type { ClientEntity } from "$lib/modules/common/common";
import type { GameLibraryFilterId } from "$lib/modules/common/domain";
import type {
	CreateGameLibraryFilterProps,
	GameLibraryFilterAggregateQuery,
} from "./game-library-filter.types";

export type GameLibraryFilter = ClientEntity<GameLibraryFilterId> & {
	get Query(): GameLibraryFilterAggregateQuery;
	get QueryVersion(): number;
	get Key(): string;
	get LastUsedAt(): Date;
	get UseCount(): number;

	readonly updateQuery: (props: { now: Date; query: GameLibraryFilterAggregateQuery }) => void;
};

export class GameLibraryFilterAggregate implements GameLibraryFilter {
	private _Id: GameLibraryFilterId;
	private _SourceLastUpdatedAt: Date;
	private _Query: GameLibraryFilterAggregateQuery;
	private _QueryVersion: number;
	private _Key: string;
	private _LastUsedAt: Date;
	private _UseCount: number;

	constructor(private readonly props: CreateGameLibraryFilterProps) {
		this._Id = props.id;
		this._SourceLastUpdatedAt = props.sourceLastUpdatedAt;
		this._Query = props.query;
		this._QueryVersion = props.queryVersion;
		this._Key = props.key;
		this._LastUsedAt = props.lastUsedAt;
		this._UseCount = props.useCount ?? 1;
	}

	get Id() {
		return this._Id;
	}

	get SourceLastUpdatedAt() {
		return this._SourceLastUpdatedAt;
	}

	get Query() {
		return this._Query;
	}

	get QueryVersion() {
		return this._QueryVersion;
	}

	get Key() {
		return this._Key;
	}

	get LastUsedAt() {
		return this._LastUsedAt;
	}

	get UseCount() {
		return this._UseCount;
	}

	updateQuery: GameLibraryFilter["updateQuery"] = ({ now, query }) => {
		this._LastUsedAt = now;
		this._SourceLastUpdatedAt = now;
		this._UseCount++;
		this._Query = query;
	};
}
