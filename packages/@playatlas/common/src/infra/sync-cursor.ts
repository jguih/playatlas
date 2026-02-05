import type { BaseEntity, BaseEntityId } from "../domain";

export type SyncCursor = {
	lastUpdatedAt: Date;
	id: string;
};

export const serializeSyncCursor = (cursor: SyncCursor): string => {
	const payload = {
		u: cursor.lastUpdatedAt.toISOString(),
		i: cursor.id,
	};

	return Buffer.from(JSON.stringify(payload)).toString("base64url");
};

export const deserializeSyncCursor = (value: string | null): SyncCursor | null => {
	if (!value) return null;

	try {
		const decoded = Buffer.from(value, "base64url").toString("utf8");
		const parsed = JSON.parse(decoded);

		if (
			typeof parsed !== "object" ||
			parsed === null ||
			typeof parsed.u !== "string" ||
			typeof parsed.i !== "string"
		) {
			return null;
		}

		const date = new Date(parsed.u);
		if (Number.isNaN(date.getTime())) {
			return null;
		}

		return {
			lastUpdatedAt: date,
			id: parsed.i,
		};
	} catch {
		return null;
	}
};

export const isValidSyncCursor = (value: string | null): value is string =>
	deserializeSyncCursor(value) !== null;

export const computeNextSyncCursor = <TEntityId extends BaseEntityId>(
	items: BaseEntity<TEntityId>[],
	lastCursor?: SyncCursor | null,
): SyncCursor => {
	if (items.length === 0) {
		return (
			lastCursor ?? {
				lastUpdatedAt: new Date(0),
				id: "",
			}
		);
	}

	// Because results are ordered by ASC,
	// the last item is always the correct cursor
	const last = items.at(-1)!;

	return {
		lastUpdatedAt: last.getLastUpdatedAt(),
		id: String(last.getId()),
	};
};
