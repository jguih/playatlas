import type { ClientRepositoryStoreName, IIndexedDbSchema } from "$lib/modules/common/infra";

export type SessionIdRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
};

export const sessionIdRepositoryMeta = {
	storeName: "session-id",
} as const satisfies SessionIdRepositoryMeta;

export const sessionIdRepositorySchema: IIndexedDbSchema = {
	define: ({ db }) => {
		if (!db.objectStoreNames.contains(sessionIdRepositoryMeta.storeName)) {
			db.createObjectStore(sessionIdRepositoryMeta.storeName, { keyPath: "SessionId" });
		}
	},
};
