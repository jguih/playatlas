import type { ClientRepositoryStoreName, IIndexedDbSchema } from "$lib/modules/common/infra";

export type SessionIdRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
};

export const sessionIdRepositoryMeta = {
	storeName: "session-id",
} as const satisfies SessionIdRepositoryMeta;

export const sessionIdRepositorySchema: IIndexedDbSchema = {
	define: ({ db }) => {
		const { storeName } = sessionIdRepositoryMeta;

		if (!db.objectStoreNames.contains(storeName)) {
			db.createObjectStore(storeName, { keyPath: "SessionId" });
		}
	},
};
